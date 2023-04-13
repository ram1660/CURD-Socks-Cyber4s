import axios from "axios";

export interface Location {
    lat: number;
    lon: number;
    base_name: string;
    nearest_city: string;
}

export interface LocationHistory {
    arrival_date: Date;
    departure_date: Date;
    location_id: string;
    sock_id: string;
}

export interface Officer {
    name: string;
    army_identity_number: string;
    email: string;
    phone_number: string;
}

export interface Socks {
    model: string;
    quantity: number;
    size: number;
    manufacturing_year: Date;
    location_id: string;
    army_identity_number: string;
}
const WEBSITE_URL = 'https://ram-sql-server.herokuapp.com' /*'http://localhost:4000'*/;

const client = axios.create({
    baseURL: WEBSITE_URL,
});

export enum TableTypes {
    LocationHistory = 'locations_history',
    Officer = 'officers',
    Socks = 'socks',
    Locations = 'locations'
}

export interface ServerAnswer {
    status: string;
    message: string;
}

export async function getSocks(): Promise<Socks[]> {
    return await (await client.get('/api/data?tableType=socks')).data as Socks[];
}

export async function createSocks(obj: Socks): Promise<ServerAnswer> {
    return await (await client.post('create/socks', {
        data: obj
    })).data as ServerAnswer;
}

export async function updateSocks(obj: Socks, socksId: string): Promise<ServerAnswer> {
    return await (await client.put('/update', {
        dataType: 'socks',
        data: obj,
        id: socksId
    })).data as ServerAnswer;
}

export async function deleteSocks(id: string): Promise<ServerAnswer> {
    return (await client.delete('/delete', {
        data: {
            dataType: 'socks',
            id: id
        }
    })).data as ServerAnswer;
}

export async function getLocation(): Promise<Location[]> {
    return await (await client.get('/api/data?tableType=locations')).data as Location[];
}

export async function createLocation(obj: Location): Promise<ServerAnswer> {
    return await (await client.post('create/location', {
        data: obj
    })).data as ServerAnswer;
}


export async function updateLocation(obj: Location, locationId: string): Promise<ServerAnswer> {
    return await (await client.put('/update', {
        dataType: 'location',
        data: obj,
        id: locationId
    })).data as ServerAnswer;
}

export async function deleteLocation(id: string): Promise<ServerAnswer> {
    return await (await client.delete('/delete', {
        data: {
            dataType: 'location',
            id: id
        }
    })).data as ServerAnswer;
}

export async function getLocationHistory(): Promise<LocationHistory[]> {
    return await (await client.get('/api/data?tableType=locations_history')).data as LocationHistory[];
}

export async function createLocationHistory(obj: LocationHistory): Promise<ServerAnswer> {
    return await (await client.post('create/location-history', {
        data: obj
    })).data as ServerAnswer;
}


export async function updateLocationHistory(obj: LocationHistory, locationHistoryId: string): Promise<ServerAnswer> {
    return await (await client.put('/update', {
        dataType: 'location_history',
        data: obj,
        id: locationHistoryId
    })).data as ServerAnswer;
}

export async function deleteLocationHistory(id: string): Promise<ServerAnswer> {
    return (await client.delete('/delete', {
        data: {
            dataType: 'location_history',
            id: id
        }
    })).data as ServerAnswer;
}

export async function getOfficers(): Promise<Officer[]> {
    return await (await client.get('/api/data?tableType=officers')).data as Officer[];
}

export async function createOfficer(obj: Officer): Promise<ServerAnswer> {
    return await (await client.post('create/officers', {
        data: obj
    })).data as ServerAnswer;
}

export async function updateOfficer(obj: Officer, officerId: string): Promise<ServerAnswer> {
    return await (await client.put('/update', {
        dataType: 'officers',
        data: obj,
        id: officerId
    })).data as ServerAnswer;
}

export async function deleteOfficer(id: string): Promise<ServerAnswer> {
    return (await client.delete('/delete', {
        data: {
            dataType: 'officers',
            id: id
        }
    })).data as ServerAnswer;
}

export async function getIds(tableType: string): Promise<string[]> {
    return await (await client.get('/api/data/id?tableType=' + tableType)).data['ids'] as string[];
}
