import { Client } from 'pg';
import 'dotenv/config';
import { TableTypes } from './tableTypes';
import { Officer, Socks, LocationHistory, Location } from 'src/shared/dbStructures';

export default class DbAccess {
    private client: Client;
    constructor() {
        this.client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        
    }

    public async connect(): Promise<void> {
        await this.client.connect();
        this.createTables();
    }

    public async pullLocations(): Promise<Array<Location>> {
        const resultsArray: Array<Location> = [];
        let rows = (await this.client.query('SELECT * FROM locations;')).rows;
        
        for(let i = 0; i < rows.length; i++) {
            resultsArray.push({
                location_id: rows[i].location_id,
                base_name: rows[i].base_name,
                lat: rows[i].lat,
                lon: rows[i].lon,
                nearest_city: rows[i].nearest_city
            });
        }
        return resultsArray;
    }

    public async pullOfficers(): Promise<Array<Officer>> {
        const resultsArray: Array<Officer> = [];
        let rows = (await this.client.query('SELECT * FROM officers;')).rows
        for(let i = 0; i < rows.length; i++) {
            resultsArray.push({
                officer_id: rows[i].officer_id,
                email: rows[i].email,
                name: rows[i].name,
                army_identity_number: rows[i].army_identity_number,
                phone_number: rows[i].phone_number
            });
        }
        return resultsArray;
    }

    public async pullSocks(): Promise<Array<Socks>> {
        const resultsArray: Array<Socks> = [];
        let rows = (await this.client.query('SELECT * FROM socks;')).rows;
        for(let i = 0; i < rows.length; i++) {
            resultsArray.push({
                location_id: rows[i].location_id,
                manufacturing_year: rows[i].manufacturing_year,
                model: rows[i].model,
                army_identity_number: rows[i].army_identity_number,
                quantity: rows[i].quantity,
                size: rows[i].size,
                sock_id: rows[i].sock_id
            });
        }
        console.log(resultsArray);
        
        return resultsArray;
    }

    public async pullLocationHistory(): Promise<Array<LocationHistory>> {
        const resultsArray: Array<LocationHistory> = [];
        let rows = (await this.client.query('SELECT * FROM locations_history;')).rows;
        for(let i = 0; i < rows.length; i++) {
            resultsArray.push({
                arrival_date: rows[i].arrival_date,
                departure_date: rows[i].departure_date,
                location_id: rows[i].Location_id,
                location_history_id: rows[i].location_history_id,
                sock_id: rows[i].sock_id
            });
        }
        return resultsArray;
    }

    private async createTables(): Promise<void> {
        await this.client.query(
            `CREATE TABLE IF NOT EXISTS locations(
            location_id SERIAL PRIMARY KEY,
            lat INTEGER NOT NULL,
            lon INTEGER NOT NULL,
            base_name TEXT NOT NULL,
            nearest_city TEXT NOT NULL
        );`
        );

        await this.client.query(
            `CREATE TABLE IF NOT EXISTS officers(
                officer_id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                army_identity_number INTEGER NOT NULL,
                email TEXT NOT NULL,
                phone_number INTEGER NOT NULL,
                UNIQUE (army_identity_number)
            );`
        );

        await this.client.query(
            `CREATE TABLE IF NOT EXISTS socks(
                sock_id SERIAL PRIMARY KEY,
                model TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                size INTEGER NOT NULL,
                manufacturing_year DATE NOT NULL,
                location_id INTEGER,
                army_identity_number INTEGER,
                UNIQUE (model),
                CONSTRAINT FK_locationID FOREIGN KEY(location_id)
                REFERENCES locations(location_id) ON DELETE CASCADE ON UPDATE CASCADE, 
                CONSTRAINT FK_army_identity_number FOREIGN KEY(army_identity_number)
                REFERENCES officers(army_identity_number) ON DELETE CASCADE ON UPDATE CASCADE
            );`
        );

        await this.client.query(
            `CREATE TABLE IF NOT EXISTS locations_history(
                    location_history_id SERIAL PRIMARY KEY,
                    arrival_date DATE NOT NULL,
                    departure_date DATE NOT NULL,
                    location_id INTEGER,
                    sock_id INTEGER,
                    CONSTRAINT FK_locationID FOREIGN KEY(location_id)
                    REFERENCES locations(location_id) ON DELETE CASCADE ON UPDATE CASCADE, 
                    CONSTRAINT FK_sockId FOREIGN KEY(sock_id)
                    REFERENCES socks(sock_id) ON DELETE CASCADE ON UPDATE CASCADE
                    );`
        );
    }

    public async insertData(data: any, tableType: TableTypes): Promise<void> {
        const numberOfArguments = Array.from({length: Object.keys(data).length}, (_, i) => i + 1);
        
        let query = `INSERT INTO ${tableType} (${Object.keys(data).toString()}) VALUES(${numberOfArguments.map((value) => {return `$${value}`}).toString()});`
        
        await this.client.query(query, Object.values(data));
    }

    public async deleteData(key: string, value: string, tableType: TableTypes): Promise<void> {
        const query = `DELETE FROM ${tableType} WHERE ${key} = ${value};`;        
        await this.client.query(query);
    }

    public async updateData(data: any, id: string, tableType: TableTypes): Promise<void> {
        let query: string = '';
        switch (tableType) {
            case TableTypes.LocationHistory:
                const locationHistoryData = data as LocationHistory;
                query = `UPDATE ${tableType} SET arrival_date = '${locationHistoryData.arrival_date}', departure_date = '${locationHistoryData.departure_date}', location_id = '${locationHistoryData.location_id}' WHERE location_history_id = ${id};`;
                break;
            case TableTypes.Locations:
                query = `UPDATE ${tableType} SET lat = ${data.lat}, lon = ${data.lon}, base_name = '${data.base_name}', nearest_city = '${data.nearest_city}' WHERE location_id = ${id};`;
                break;
            case TableTypes.Officer:
                const officerData = data as Officer;
                query = `UPDATE ${tableType} SET name = '${officerData.name}', army_identity_number = ${officerData.army_identity_number}, email = '${officerData.email}', phone_number = ${officerData.phone_number} WHERE officer_id = ${id};`
                break;
            case TableTypes.Socks:
                const socksData = data as Socks;
                query = `UPDATE ${tableType} SET model = '${socksData.model}', quantity = ${socksData.quantity}, size = ${socksData.size}, manufacturing_year = '${socksData.manufacturing_year}', location_id = ${socksData.location_id}, army_identity_number = ${socksData.army_identity_number} WHERE sock_id = ${id};`;
            default:
                break;
        }
        await this.client.query(query);
    }
}
