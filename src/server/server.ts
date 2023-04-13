import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import bodyParser, { json } from 'body-parser';
// import moment from 'moment';
import DbAccess from './dbAccess';
import { TableTypes } from './tableTypes';


const app: Express = express();
const root: string = path.join(process.cwd(), 'dist');
const port = process.env.PORT || 4000;
const db = new DbAccess();
// app.options('*', cors())
app.use(cors());
app.use(json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(root));

app.get('/', (_req, res) => {
  res.sendFile(path.join(root), 'pages/index.html');
});

app.put('/update', async (req, res) => {
  switch (req.body.dataType) {
    case 'location_history':
      await db.updateData(req.body.data, req.body.id, TableTypes.LocationHistory);
      break;
    case 'officers':
      const officerDbId = (await db.pullOfficers()).find((officer) => officer.army_identity_number == req.body.id)?.officer_id;
      await db.updateData(req.body.data, officerDbId!, TableTypes.Officer);
      break;
    case 'socks':
      await db.updateData(req.body.data, req.body.id, TableTypes.Socks);
      break;
    case 'location':
      await db.updateData(req.body.data, req.body.id, TableTypes.Locations);
      break;
    default:
      break;
  }
  res.sendStatus(200);
});

app.get('/api/data', async (req, res) => {
  switch (req.query.tableType) {
    case 'locations_history':
      res.json(await db.pullLocationHistory());
      break;
    case 'officers':
      res.json(await db.pullOfficers());
      break;
    case 'socks':
      res.json(await db.pullSocks());
      break;
    case 'locations':
      res.json(await db.pullLocations());
      break;
    default:
      break;
  }
});

app.post('/create/:type', async (req, res) => {
  const clientData = req.body.data;

  switch (req.params.type) {
    case 'socks':
      try {
        await db.insertData(req.body.data, TableTypes.Socks);
      } catch (error) {
        console.log(error);
        res.json({ status: 'failed', message: 'Failed to insert the data! Could be a duplicated data?' });
        return;
      }
      break;
    case 'officers':
      try {
        await db.insertData(clientData, TableTypes.Officer);
      } catch (error) {
        res.json({ status: 'failed', message: 'Failed to insert the data! Could be a duplicated data?' });
        return;
      }
      break;
    case 'location':
      try {
        await db.insertData(clientData as Location, TableTypes.Locations);
      } catch (error) {
        res.json({ status: 'failed', message: 'Failed to insert the data! Could be a duplicated data?' });
        return;
      }
      break;
    case 'location-history':
      try {
        await db.insertData(clientData, TableTypes.LocationHistory);
      } catch (error) {
        res.json({ status: 'failed', message: 'Failed to insert the data! Could be a duplicated data?' });
        console.log((error as any).message);

        return;
      }
      break;

  }
  res.json({ status: 'success', message: 'Added successfully!' });
});

app.get('/api/data/id', async (req, res) => {
  switch (req.query.tableType) {
    case 'locations_history':
      res.json({'ids' : (await db.pullLocationHistory()).map((value) => value.location_history_id)});
      break;
    case 'officers':
      res.json({ 'ids': (await db.pullOfficers()).map((value) => value.army_identity_number) });
      break;
    case 'socks':
      res.json({ 'ids': (await db.pullSocks()).map((value) => value.sock_id) });
      break;
    case 'locations':
      res.json({ 'ids': ((await db.pullLocations()).map((value) => value.location_id)) });
      break;
    default:
      break;
  }
});

app.delete('/delete', async (req, res) => {
  try {
    switch (req.body.dataType) {
      case 'location_history':
        await db.deleteData('location_history_id', req.body.id, TableTypes.LocationHistory);
        break;
      case 'officers':
        await db.deleteData('army_identity_number', req.body.id, TableTypes.Officer);
        break;
      case 'socks':
        await db.deleteData('sock_id', req.body.id, TableTypes.Socks);
        break;
      case 'location':
        await db.deleteData('location_id', req.body.id, TableTypes.Locations);
        break;
      default:
        break;

    }
    res.json({status: 'success', message: 'Deletion successful'});
  } catch (error) {
    res.json({ status: 'failed', message: 'This row is tied to other tables. Please remove or change them before delete this row' });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(root, 'pages/index.html'));
});
async function main() {
  await db.connect();
  app.listen(port, () => {
    console.log('Hosted: http://localhost:' + port);
  });
}

main();
