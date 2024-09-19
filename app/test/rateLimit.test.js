import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; // Ajusta la ruta según la ubicación de tu archivo app.js

const { expect } = chai;
chai.use(chaiHttp);

describe('Rate Limiting', () => {
    it('should return 429 after exceeding rate limit', (done) => {
        const endpoint = '/api/'; // Cambia esto a la ruta que deseas probar
        const requests = 101; // Número total de solicitudes que debes hacer para superar el límite

        let requestCount = 0;

        function makeRequest() {
            return chai.request(app)
                .get(endpoint)
                .then((response) => {
                    if (requestCount < 100) {
                        expect(response).to.have.status(200); // Primeras solicitudes deben ser exitosas
                    } else {
                        expect(response).to.have.status(429); // Después de superar el límite
                        done();
                    }
                })
                .catch((err) => {
                    expect(err.response).to.have.status(429); // Después de superar el límite
                    done();
                });
        }

        function makeRequests(count) {
            if (count > 0) {
                requestCount++;
                return makeRequest().then(() => makeRequests(count - 1));
            }
        }

        makeRequests(requests);
    });
});
