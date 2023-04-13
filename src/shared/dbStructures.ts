/*
This file represents the tables of the db as interfaces.
This file is used by the client and the server to avoid typos when reading from the client or the server
*/

export interface Location {
  location_id: string;
  lat: number;
  lon: number;
  base_name: string;
  nearest_city: string;
}

export interface LocationHistory {
  location_history_id: string;
  arrival_date: Date;
  departure_date: Date;
  location_id: string;
  sock_id: string;
}

export interface Officer {
  officer_id: string;
  name: string;
  army_identity_number: string;
  email: string;
  phone_number: string;
}

export interface Socks{
  sock_id: string;
  model: string;
  quantity: number;
  size: number;
  manufacturing_year: Date;
  location_id: string;
  army_identity_number: number;
}
