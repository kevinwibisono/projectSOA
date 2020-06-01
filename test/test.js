const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

// describe('/api/user/deleteUser', () =>{
//     it('Delete user (Admin)', (done)=>{
//         chai.request('http://localhost:3000')
//             .delete('/api/user/deleteUser?apiKey=6HTHhdHIGLpD4sjoCUJeSWpTjbPQd1')
//             .send({
//                 username:"testinguserfree6"
//             })
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(200);
//                 res.body.should.have.property('message').eql("Berhasil hapus user!");
//                 done();
//             })
//     });

//     it('Delete user sendiri', (done)=>{
//         chai.request('http://localhost:3000')
//         .delete('/api/user/deleteUser?apiKey=oIHrg1K2BbEvNP1pZGC2xVh7MtNgoU')
//         .send({
//             username:"usermatthew6"
//         })
//         .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a('object');
//             res.body.should.have.property('status').eql(200);
//             res.body.should.have.property('message').eql("Berhasil hapus user!");
//             done();
//         })
//     });

//     it('User tidak ditemukan', (done)=>{
//         chai.request('http://localhost:3000')
//         .delete('/api/user/deleteUser?apiKey=az')
//         .send({
//              username:"usermatthew6"
//         })
//         .end((err, res) => {
//             res.should.have.status(404);
//             res.body.should.be.a('object');
//             res.body.should.have.property('status').eql(404);
//             res.body.should.have.property('message').eql("User tidak ditemukan!");
//             done();
//         })
//     });

//     it('User biasa menghapus user lain', (done)=>{
//         chai.request('http://localhost:3000')
//         .delete('/api/user/deleteUser?apiKey=oIHrg1K2BbEvNP1pZGC2xVh7MtNgoU')
//         .send({
//             username : "usermatthew5"
//         })
//         .end((err, res) => {
//             res.should.have.status(401);
//             res.body.should.be.a('object');
//             res.body.should.have.property('status').eql(401);
//             res.body.should.have.property('message').eql("User tidak memiliki hak akses untuk menghapus user lain!");
//             done();
//         })
//     });
//     it('Tidak ada API Key', (done)=>{
//         chai.request('http://localhost:3000')
//         .delete('/api/user/deleteUser?apiKey=')
//         .send({
//         })
//         .end((err, res) => {
//             res.should.have.status(400);
//             res.body.should.be.a('object');
//             res.body.should.have.property('status').eql(400);
//             res.body.should.have.property('message').eql("Field API Key harus terisi");
//             done();
//         })
//     });
// });

// describe('/api/resto/searchResto', () =>{
//     it('API Key tidak valid', (done)=>{
//         chai.request('http://localhost:3000')
//             .get('/api/resto/getResto?apiKey=')
//             .send({
//             })
//             .end((err, res) => {
//                 res.should.have.status(404);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(404);
//                 res.body.should.have.property('message').eql("API key tidak ditemukan");
//                 done();
//             })
//     });
//     it('Tidak ada API key', (done)=>{
//         chai.request('http://localhost:3000')
//             .get('/api/resto/getResto')
//             .send({
//             })
//             .end((err, res) => {
//                 res.should.have.status(400);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(400);
//                 res.body.should.have.property('message').eql("Field API Key harus terisi");
//                 done();
//             })
//     });
//     it('Search resto valid', (done)=>{
//         chai.request('http://localhost:3000')
//             .get('/api/resto/getResto?apiKey=x5iUy6PzGTOjnkxuiQG6OeHNiW8WpL')
//             .send({
//                 resto_id : "16774318"
//             })
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//                 done();
//             })
//     });
//     it('API Hit tidak cukup', (done)=>{
//         chai.request('http://localhost:3000')
//             .get('/api/resto/getResto?apiKey=PGHizyPZKl4K5XpsMjbw4455IiGboH')
//             .send({
//                 resto_id : "16774318"
//             })
//             .end((err, res) => {
//                 res.should.have.status(401);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(401);
//                 res.body.should.have.property('message').eql("API hit tidak cukup");
//                 done();
//             })
//     });
// });

// describe('/api/review/getReview', () =>{
//     it('Tidak ada API key', (done)=>{
//         chai.request('http://localhost:3000')
//             .get('/api/review/getReview?apiKey=')
//             .send({
//             })
//             .end((err, res) => {
//                 res.should.have.status(404);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(404);
//                 res.body.should.have.property('message').eql("API key tidak ditemukan");
//                 done();
//             })
//     });
//     it('Get Review Valid', (done)=>{
//         chai.request('http://localhost:3000')
//             .get('/api/review/getReview?apiKey=L7JVXQH9Iky0r0tK4Abxk4lwPdWFt6')
//             .send({
//             })
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('array');
//                 done();
//             })
//     });
//     it('Tidak ada API key', (done)=>{
//         chai.request('http://localhost:3000')
//             .get('/api/review/getReview')
//             .send({
//             })
//             .end((err, res) => {
//                 res.should.have.status(400);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(400);
//                 res.body.should.have.property('message').eql("Field API Key harus terisi");
//                 done();
//             })
//     });
//     it('API Hit tidak cukup', (done)=>{
//         chai.request('http://localhost:3000')
//             .get('/api/review/getReview?apiKey=PGHizyPZKl4K5XpsMjbw4455IiGboH')
//             .send({
//             })
//             .end((err, res) => {
//                 res.should.have.status(401);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(401);
//                 res.body.should.have.property('message').eql("API hit tidak cukup");
//                 done();
//             })
//     });
// });

// describe('/api/collec/likeCollection', () =>{
//     it('API Key tidak valid', (done)=>{
//         chai.request('http://localhost:3000')
//             .post('/api/collec/likeCollection?apiKey=')
//             .send({
//             })
//             .end((err, res) => {
//                 res.should.have.status(404);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(404);
//                 res.body.should.have.property('message').eql("API key tidak ditemukan");
//                 done();
//             })
//     });
//     it('Berhasil like collection', (done)=>{
//         chai.request('http://localhost:3000')
//             .post('/api/collec/likeCollection?apiKey=L7JVXQH9Iky0r0tK4Abxk4lwPdWFt6')
//             .send({
//                 id_collection : "9"
//             })
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(200);
//                 res.body.should.have.property('message').eql("Berhasil like collection!");
//                 done();
//             })
//     });
//     it('Collection sudah dilike', (done)=>{
//         chai.request('http://localhost:3000')
//             .post('/api/collec/likeCollection?apiKey=L7JVXQH9Iky0r0tK4Abxk4lwPdWFt6')
//             .send({
//                 id_collection : "9"
//             })
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(200);
//                 res.body.should.have.property('message').eql("User telah memfavorite kan collection!");
//                 done();
//             })
//     });
//     it('Tidak ada API key', (done)=>{
//         chai.request('http://localhost:3000')
//             .post('/api/collec/likeCollection')
//             .send({
//                 id_collection : "9"
//             })
//             .end((err, res) => {
//                 res.should.have.status(400);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(400);
//                 res.body.should.have.property('message').eql("Field API Key harus terisi");
//                 done();
//             })
//     });
//     it('API Hit tidak cukup', (done)=>{
//         chai.request('http://localhost:3000')
//             .post('/api/collec/likeCollection?apiKey=PGHizyPZKl4K5XpsMjbw4455IiGboH')
//             .send({
//                 id_collection : "9"
//             })
//             .end((err, res) => {
//                 res.should.have.status(401);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(401);
//                 res.body.should.have.property('message').eql("API hit tidak cukup");
//                 done();
//             })
//     });
// });

// describe('/api/collec/unlikeCollection', () =>{
//     it('API Key tidak valid', (done)=>{
//         chai.request('http://localhost:3000')
//             .post('/api/collec/unlikeCollection?apiKey=')
//             .send({
//             })
//             .end((err, res) => {
//                 res.should.have.status(404);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(404);
//                 res.body.should.have.property('message').eql("API key tidak ditemukan");
//                 done();
//             })
//     });
//     it('Berhasil unlike collection', (done)=>{
//         chai.request('http://localhost:3000')
//             .post('/api/collec/unlikeCollection?apiKey=L7JVXQH9Iky0r0tK4Abxk4lwPdWFt6')
//             .send({
//                 id_collection : "9"
//             })
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(200);
//                 res.body.should.have.property('message').eql("Berhasil unlike collection!");
//                 done();
//             })
//     });
//     it('Unlike collection yang tidak pernah dilike', (done)=>{
//         chai.request('http://localhost:3000')
//             .post('/api/collec/unlikeCollection?apiKey=L7JVXQH9Iky0r0tK4Abxk4lwPdWFt6')
//             .send({
//                 id_collection : "8"
//             })
//             .end((err, res) => {
//                 res.should.have.status(400);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(400);
//                 res.body.should.have.property('message').eql("User tidak memfavorite kan collection!");
//                 done();
//             })
//     });
//     it('Tidak ada API key', (done)=>{
//         chai.request('http://localhost:3000')
//             .post('/api/collec/unlikeCollection')
//             .send({
//                 id_collection : "9"
//             })
//             .end((err, res) => {
//                 res.should.have.status(400);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(400);
//                 res.body.should.have.property('message').eql("Field API Key harus terisi");
//                 done();
//             })
//     });
//     it('API Hit tidak cukup', (done)=>{
//         chai.request('http://localhost:3000')
//             .post('/api/collec/unlikeCollection?apiKey=PGHizyPZKl4K5XpsMjbw4455IiGboH')
//             .send({
//                 id_collection : "9"
//             })
//             .end((err, res) => {
//                 res.should.have.status(401);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql(401);
//                 res.body.should.have.property('message').eql("API hit tidak cukup");
//                 done();
//             })
//     });
// });

describe('/api/collec/getAllCuisineinCity', () =>{
    it('API Key tidak valid', (done)=>{
        chai.request('http://localhost:3000')
            .get('/api/collec/getAllCuisineinCity?apiKey=az')
            .send({
                city_id : "280"
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(404);
                res.body.should.have.property('message').eql("API key tidak ditemukan");
                done();
            })
    });
    it('Tidak ada API key', (done)=>{
        chai.request('http://localhost:3000')
            .get('/api/collec/getAllCuisineinCity')
            .send({
                city_id : "280"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql("Field API Key harus terisi");
                done();
            })
    });
    it('API Hit tidak cukup', (done)=>{
        chai.request('http://localhost:3000')
            .get('/api/collec/getAllCuisineinCity?apiKey=PGHizyPZKl4K5XpsMjbw4455IiGboH')
            .send({
                city_id : "280"
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(401);
                res.body.should.have.property('message').eql("API hit tidak cukup");
                done();
            })
    });
    it('Berhasil dapatkan semua cuisine dalam satu kota', (done)=>{
        chai.request('http://localhost:3000')
            .get('/api/collec/getAllCuisineinCity?apiKey=L7JVXQH9Iky0r0tK4Abxk4lwPdWFt6')
            .send({
                city_id : "280"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    });
});