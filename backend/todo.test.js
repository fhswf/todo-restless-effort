import request from 'supertest';
import { app, server, db } from './index';
import getKeycloakToken from './utils';

let token; // Speichert den abgerufenen JWT-Token

beforeAll(async () => {
    token = await getKeycloakToken();
});

describe('GET /todos (unautorisiert)', () => {
    it('sollte einen 401-Fehler zurückgeben, wenn kein Token bereitgestellt wird', async () => {
        const response = await request(app).get('/todos'); // Kein Authorization-Header

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe('Unauthorized');
    });
});

describe('GET /todos', () => {
    it('sollte alle Todos abrufen', async () => {
        const response = await request(app)
            .get('/todos')
            .set('Authorization', `Bearer ${token}`); // Fügen Sie den Authorization-Header hinzu

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });
});

describe('POST /todos', () => {
    it('sollte ein neues Todo erstellen', async () => {
        const newTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.due).toBe(newTodo.due);
    });

    it('sollte einen 400-Fehler zurückgeben, wenn das Todo unvollständig ist', async () => {
        const newTodo = {
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0,
        };

        const response = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Bad Request');
    });

    it('sollte einen 400-Fehler zurückgeben, wenn das Todo nicht valide ist', async () => {
        const newTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0,
            "invalid": "invalid"
        };

        const response = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Bad Request');
    });
}); 0

describe('GET /todos/:id', () => {
    it('sollte ein Todo abrufen', async () => {
        const newTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo);

        const id = response.body._id;

        const getResponse = await request(app)
            .get(`/todos/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body.title).toBe(newTodo.title);
        expect(getResponse.body.due).toBe(newTodo.due);
    });

    it('sollte einen 404-Fehler zurückgeben, wenn das Todo nicht gefunden wurde', async () => {
        const id = '123456789012345678901234';

        const getResponse = await request(app)
            .get(`/todos/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getResponse.statusCode).toBe(404);
        expect(getResponse.body.error).toMatch(/Todo with id .+ not found/);
    });
});

describe('PUT /todos/:id', () => {
    it('sollte ein Todo aktualisieren', async () => {
        const newTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo);

        const updatedTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 1,
            "_id": response.body._id
        };

        const updateResponse = await request(app)
            .put(`/todos/${response.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedTodo);

        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.body.status).toBe(updatedTodo.status);
    });
});

describe('DELETE /todos/:id', () => {
    it('sollte ein Todo löschen', async () => {
        const newTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send(newTodo);

        const deleteResponse = await request(app)
            .delete(`/todos/${response.body._id}`)
            .set('Authorization', `Bearer ${token}`);


        expect(deleteResponse.statusCode).toBe(204);

        const getResponse = await request(app)
            .get(`/todos/${response.body._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getResponse.statusCode).toBe(404);
    });
});

describe('POST /todos (erweiterte Validierung)', () => {
    it('sollte einen 400-Fehler zurückgeben, wenn der Titel zu kurz ist', async () => {
      const newTodo = {
        "title": "Ab",
        "due": "2022-11-12T00:00:00.000Z",
        "status": 0
      };
      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send(newTodo);
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Titel muss mindestens 3 Zeichen lang sein'
        })
      );
    });
  
    it('sollte einen 400-Fehler zurückgeben, wenn das Datum ungültig ist', async () => {
      const newTodo = {
        "title": "Gültiger Titel",
        "due": "ungültiges-datum",
        "status": 0
      };
      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send(newTodo);
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Ungültiges Datum'
        })
      );
    });
  });

  
  describe('POST /todos (Grenzwerte)', () => {
    it('sollte ein Todo mit maximal erlaubter Titellänge erstellen', async () => {
      const maxTitleLength = 100; // Angenommene maximale Länge
      const newTodo = {
        "title": "A".repeat(maxTitleLength),
        "due": "2022-11-12T00:00:00.000Z",
        "status": 0
      };
      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send(newTodo);
      expect(response.statusCode).toBe(201);
      expect(response.body.title.length).toBe(maxTitleLength);
    });
  
    it('sollte einen 400-Fehler zurückgeben, wenn der Status außerhalb des gültigen Bereichs liegt', async () => {
      const newTodo = {
        "title": "Gültiger Titel",
        "due": "2022-11-12T00:00:00.000Z",
        "status": 3 // Angenommen, gültige Werte sind 0, 1, 2
      };
      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send(newTodo);
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Ungültiger Status'
        })
      );
    });
  });

  
  describe('Datenbankoperationen', () => {
    it('sollte eine Verbindung zur Datenbank herstellen', async () => {
      const testDb = new DB();
      await expect(testDb.connect()).resolves.not.toThrow();
      await testDb.close();
    });
  
    it('sollte ein Todo in die Datenbank einfügen und wieder abrufen', async () => {
      const newTodo = {
        "title": "Test Todo",
        "due": "2022-11-12T00:00:00.000Z",
        "status": 0
      };
      const insertedTodo = await db.insert(newTodo);
      expect(insertedTodo._id).toBeDefined();
  
      const retrievedTodo = await db.queryById(insertedTodo._id);
      expect(retrievedTodo).toEqual(expect.objectContaining(newTodo));
  
      await db.delete(insertedTodo._id);
    });
  });



afterAll(async () => {
    server.close()
    db.close()
})
