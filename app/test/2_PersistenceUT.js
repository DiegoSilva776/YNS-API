/**
 * This file aims to test all the controllers of this system.
 * 
 * About de dependencies
 * Mocha - Describe, run and build tests
 * Chi - Check values within the tests
 */

const expect = require("chai").expect;

const dbUtils = require("../utils/DbUtils");

const userPersistence = require("../persistence/UserPersistence");

dbUtils.connectToFirebaseDB();

describe("Persistence", function() {
    
    describe("CRUD User", function() {
        this.timeout(10000);

        it("Should upsert, find and delete User", function(done) {
            // Upsert 1
            userPersistence.upsertUser(
                "user1@email.com",
                "User 1", 
                "test_profilePic_1", 
                "latestViewedNotification_1",
                function(opStatus1) {
                    expect(opStatus1).to.be.equal(true);

                    // Upsert 2
                    userPersistence.upsertUser(
                        "user2@email.com",
                        "User 2", 
                        "test_profilePic_2", 
                        "latestViewedNotification_2",
                        function(opStatus2) {
                            expect(opStatus2).to.be.equal(true);

                            // Find one
                            userPersistence.findUser(
                                "user1@email.com",
                                function(success, user) {
                                    expect(success).to.be.equal(true);
                                    expect(user.email).to.be.equal("user1@email.com",);
                                    expect(user.name).to.be.equal("User 1");
                                    expect(user.profilePic).to.be.equal("test_profilePic_1");
                                    expect(user.latestViewedNotification).to.be.equal("latestViewedNotification_1");
                                    
                                    // Find all
                                    userPersistence.findAll(
                                        function(success, users) {
                                            expect(success).to.be.equal(true);

                                            // Delete
                                            userPersistence.deleteUser(
                                                "user1@email.com",
                                                function(opStatus3) {
                                                    expect(opStatus3).to.equal(true);

                                                    userPersistence.deleteUser(
                                                        "user2@email.com",
                                                        function(opStatus4) {
                                                            expect(opStatus4).to.equal(true);
        
                                                            done();
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        });
    });

});