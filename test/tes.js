const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);


describe('/api/user/loginUser', () =>{
    it('User Tidak Ada', (done)=>{
        chai.request('http://localhost:4000')
            .post('/api/user/buySubscriptioin?username=ax&password=ax')
            .send({
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql("User tidak ditemukan!");
                done();
            })
	});
	
	 it('Berhasil Login', (done)=>{
        chai.request('http://localhost:4000')
            .post('/api/user/buySubscriptioin?username=freeuser&password=free')
            .send({
                username:"freeuser"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(200);
                res.body.should.have.property('message').eql("Berhasil Login");
                done();
            })
	});
});

describe('/api/user/buySubscription', () =>{
    it('API key Invalid', (done)=>{
        chai.request('http://localhost:4000')
            .post('/api/user/buySubscriptioin?apikey=')
            .send({
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(404);
                res.body.should.have.property('message').eql("APIKey not found. You are not authorized");
                done();
            })
	});
	
	 it('Sebagai Admin', (done)=>{
        chai.request('http://localhost:4000')
            .post('/api/user/buySubscriptioin?apikey=6HTHhdHIGLpD4sjoCUJeSWpTjbPQd1')
            .send({
                username:"admin"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql("Anda sebagai Admin");
                done();
            })
	});
	
	it('Tambah APIHIT', (done)=>{
        chai.request('http://localhost:4000')
            .post('/api/user/buySubscriptioin?apikey=XRKtjahQS0r3RnmnHa3flh7pay1w4t')
            .send({
                username:"testfreeuser2"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(200);
                res.body.should.have.property('message').eql("Berhasil Menambah APIHIT");
                done();
            })
	});
	
	it('Saldo Tidak Cukup', (done)=>{
        chai.request('http://localhost:4000')
            .post('/api/user/buySubscriptioin?apikey=V536uolnxOXrccmITUpFKHCRXXgSQN')
            .send({
                username:"testinguserfree4"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql("Saldo user tidak mencukupi");
                done();
            })
	});
});

describe('/api/user/deleteCollection', () =>{
    it('API key Invalid', (done)=>{
        chai.request('http://localhost:4000')
            .delete('/api/user/buySubscriptioin?apikey=')
            .send({
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(404);
                res.body.should.have.property('message').eql("APIKey not found. You are not authorized");
                done();
            })
	});
	
	 it('Sebagai Admin', (done)=>{
        chai.request('http://localhost:4000')
            .delete('/api/user/buySubscriptioin?username=admin&password=admin&id=8')
            .send({
                username:"admin"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(200);
                res.body.should.have.property('message').eql("Berhasil menghapus Collection!");
                done();
            })
    });
    
    it('Tidak dapat menemukan collection', (done)=>{
        chai.request('http://localhost:4000')
            .delete('/api/user/buySubscriptioin?username=admin&password=admin&id=')
            .send({
                username:"admin"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql("Tidak dapat menemukan Collection!");
                done();
            })
	});
	
	it('User biasa', (done)=>{
        chai.request('http://localhost:4000')
            .delete('/api/user/buySubscriptioin?username=testfreeuser2&password=testfree2&id=8')
            .send({
                username:"testfreeuser2"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(200);
                res.body.should.have.property('message').eql("Berhasil menghapus Collection!");
                done();
            })
	});
});

describe('/api/user/editReview', () =>{
    it('API key Invalid', (done)=>{
        chai.request('http://localhost:4000')
            .post('/api/user/buySubscriptioin?apikey=')
            .send({
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(404);
                res.body.should.have.property('message').eql("APIKey not found. You are not authorized");
                done();
            })
	});
	
	it('Ubah Review', (done)=>{
        chai.request('http://localhost:4000')
            .post('/api/user/buySubscriptioin?username=freeuser&password=free&id=24')
            .send({
                username:"freeuser"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(200);
                res.body.should.have.property('message').eql("Telah Merubah Review / Comment!");
                done();
            })
    });
    
    it('Ubah Review', (done)=>{
        chai.request('http://localhost:4000')
            .post('/api/user/buySubscriptioin?username=freeuser&password=free&id=')
            .send({
                username:"freeuser"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql("Tidak dapat menemukan Review / Comment!");
                done();
            })
    });
});

describe('/api/resto/getLocation', () =>{
    it('API key Invalid', (done)=>{
        chai.request('http://localhost:4000')
            .get('/api/user/buySubscriptioin?apikey=')
            .send({
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(404);
                res.body.should.have.property('message').eql("APIKey not found. You are not authorized");
                done();
            })
	});
	
	it('Get Location Valid', (done)=>{
        chai.request('http://localhost:4000')
            .gett('/api/resto/getLocation?apiKey=Lj6QJ441EEW1nbQZDjqvQYV8kMOVAc')
            .send({
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    });
    
    it('API Hit tidak cukup', (done)=>{
        chai.request('http://localhost:4000')
            .get('/api/review/getReview?apiKey=Lj6QJ441EEW1nbQZDjqvQYV8kMOVAc')
            .send({
            })
            .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(401);
            res.body.should.have.property('message').eql("API hit tidak cukup");
            done();
        })
     });
});