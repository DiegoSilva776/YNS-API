/**
 * This file aims to test all the controllers of this system.
 * 
 * About de dependencies
 * Mocha - Describe, run and build tests
 * Chi - Check values within the tests
 */

const expect = require("chai").expect;

const dbUtils = require("../utils/DbUtils");

const userController = require("../controllers/UserController");

dbUtils.connectToFirebaseDB();

describe("Controllers", function() {
    
    describe("CRUD User", function() {

        it("Should upsert, find and delete User", function(done) {
            // Upsert 1
            userController.upsertUser(
                "test_email_1",
                "test_name_1", 
                "test_profilePic_1", 
                "latestViewedNotification_1",
                function(opStatus1) {
                    expect(opStatus1).to.be.equal(true);

                    // Upsert 2
                    userController.upsertUser(
                        "test_email_2",
                        "test_name_2", 
                        "test_profilePic_2", 
                        "latestViewedNotification_2",
                        function(opStatus2) {
                            expect(opStatus2).to.be.equal(true);

                            // Find one
                            userController.findUser(
                                "test_email_1",
                                function(success, user) {
                                    expect(success).to.be.equal(true);
                                    expect(user.email).to.be.equal("test_email_1",);
                                    expect(user.name).to.be.equal("test_name_1");
                                    expect(user.profilePic).to.be.equal("test_profilePic_1");
                                    expect(user.latestViewedNotification).to.be.equal("latestViewedNotification");
                                    
                                    // Find all
                                    userController.findAll(
                                        function(success, users) {
                                            expect(success).to.be.equal(true);

                                            // Delete
                                            userController.deleteUser(
                                                "test_email_1",
                                                function(opStatus3) {
                                                    expect(opStatus3).to.equal(true);

                                                    userController.deleteUser(
                                                        "test_email_2",
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