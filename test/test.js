const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

//matthew
// describe('/api/user/deleteUser', () =>{
//     it('Delete user (Admin)', (done)=>{
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
//         chai.request('http://restaurant-api-2020.herokuapp.com')
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
        chai.request('http://restaurant-api-2020.herokuapp.com')
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
        chai.request('http://restaurant-api-2020.herokuapp.com')
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
        chai.request('http://restaurant-api-2020.herokuapp.com')
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
        chai.request('http://restaurant-api-2020.herokuapp.com')
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
/////////////////////////////////////////////////////////////////////
//joel
describe('/api/user/loginUser', () =>{
    it('User Tidak Ada', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
        .post('/api/user/loginUser')
        .send({
            username : 'ax',
            password : 'ax'
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
        chai.request('http://restaurant-api-2020.herokuapp.com')
        .post('/api/user/loginUser')
        .send({
            username:"freeuser",
            password : 'free'
        })
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(200);
            res.body.should.have.property('message').eql("Berhasil Login, API anda = Lj6QJ441EEW1nbQZDjqvQYV8kMOVAc");
            done();
        })
	});
});
/////////////////////////////////////////////////////////////////////
describe('/api/user/buySubscription', () =>{
    it('API key Not Found', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .post('/api/user/buySubscription')
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
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .post('/api/user/buySubscription?apikey=6HTHhdHIGLpD4sjoCUJeSWpTjbPQd1')
            .send({
                username:"admin",
                password : "admin"
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
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .post('/api/user/buySubscription?apikey=XRKtjahQS0r3RnmnHa3flh7pay1w4t')
            .send({
                username:"testfreeuser2",
                password:"testfree2"
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
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .post('/api/user/buySubscription?apikey=V536uolnxOXrccmITUpFKHCRXXgSQN')
            .send({
                username:"testinguserfree4",
                password: "123"
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

/////////////////////////////////////////////////////////////////////
describe('/api/user/deleteCollection', () =>{
    it('API key Not Found', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .delete('/api/collec/deleteCollection')
            .send({
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql("APIKey not found. You are not authorized");
                done();
            })
    });
	
	 it('Sebagai Admin', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .delete('/api/collec/deleteCollection?apikey=6HTHhdHIGLpD4sjoCUJeSWpTjbPQd1')
            .send({
                id : "15"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(200);
                res.body.should.have.property('message').eql("Berhasil menghapus Collection!");
                done();
            })
    });
    
    it('Tidak dapat menemukan collection admin', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .delete('/api/collec/deleteCollection?apikey=6HTHhdHIGLpD4sjoCUJeSWpTjbPQd1')
            .send({
                id : "x"
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
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .delete('/api/collec/deleteCollection?apikey=Lj6QJ441EEW1nbQZDjqvQYV8kMOVAc')
            .send({
                id : '13'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(200);
                res.body.should.have.property('message').eql("Berhasil menghapus Collection!");
                done();
            })
    });
    
    it('Tidak dapat menemukan collection user', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .delete('/api/collec/deleteCollection?apikey=Lj6QJ441EEW1nbQZDjqvQYV8kMOVAc')
            .send({
                id : "x"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql("Tidak dapat menemukan Collection!");
                done();
            })
    });
    
    it('Tidak dapat menemukan user', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .delete('/api/collec/deleteCollection?apikey=z')
            .send({
                usertab:"joe",
                id : "x"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql("Tidak dapat menemukan USER!");
                done();
            })
	});
});
/////////////////////////////////////////////////////////////////////
describe('/api/user/editReview', () =>{
    it('API key Invalid', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .post('/api/user/editReview?')
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
	
	it('Ubah Review admin', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
        .post('/api/user/editReview?apikey=6HTHhdHIGLpD4sjoCUJeSWpTjbPQd1')
        .send({
            id:"x",
            review:"x"
        })
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(400);
            res.body.should.have.property('message').eql("Anda Sebagai Admin");
            done();
        })
    });
    
    it('Ubah Review user', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
        .post('/api/user/editReview?apikey=Lj6QJ441EEW1nbQZDjqvQYV8kMOVAc')
        .send({
            id:"24",
            review:"diedit duakali lho review nya"
        })
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(200);
            res.body.should.have.property('message').eql("Telah Merubah Review / Comment!");
            done();
        })
    });

    it('Ubah Review user', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
        .post('/api/user/editReview?apikey=Lj6QJ441EEW1nbQZDjqvQYV8kMOVAc')
        .send({
            id:"x",
            review:"x"
        })
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(400);
            res.body.should.have.property('message').eql("Tidak dapat menemukan Review / Comment!");
            done();
        })
    });

    it('Ubah Review user', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
        .post('/api/user/editReview?apikey=x')
        .send({
            id:"x",
            review:"x"
        })
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(400);
            res.body.should.have.property('message').eql("Tidak dapat menemukan USER!");
            done();
        })
    });
});

////////////////////////////////////////////////////////////////
describe('/api/resto/getLocation', () =>{
    it('API key Invalid', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .get('/api/resto/getLocation?apikey=')
            .send({
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql("Field API Key harus terisi");
                done();
            })
	});
	
    it('API Hit tidak ditemukan', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .get('/api/resto/getLocation?apiKey=x')
            .send({
                query:"x"
            })
            .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(404);
            res.body.should.have.property('message').eql("API key tidak ditemukan");
            done();
        })
     });
    
    it('API Hit tidak cukup', (done)=>{
        chai.request('http://restaurant-api-2020.herokuapp.com')
            .get('/api/resto/getLocation?apiKey=GfI2Y8CdpgCQPFrygAxK7vchY5eyF2')
            .send({
                query:"indonesia"
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
