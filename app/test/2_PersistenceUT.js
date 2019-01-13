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
const notificationPersistence = require("../persistence/NotificationPersistence");
const userNotificationPersistence = require("../persistence/UserNotificationPersistence");

dbUtils.connectToFirebaseDB();

describe("Persistence", function() {
    
    describe("CRUD User", function() {
        this.timeout(10000);

        // TODO: Start using Promises
        it("Should upsert, find and delete Users", function(done) {
            // Upsert 1
            userPersistence.upsertUser(
                "t.user.1@email.com",
                "User 1", 
                "test_profilePic_1", 
                "latestViewedNotification_1",
                function(opStatus1) {
                    expect(opStatus1).to.be.equal(true);

                    // Upsert 2
                    userPersistence.upsertUser(
                        "t.user.2@email.com",
                        "User 2", 
                        "test_profilePic_2", 
                        "latestViewedNotification_2",
                        function(opStatus2) {
                            expect(opStatus2).to.be.equal(true);

                            // Find one
                            userPersistence.findUser(
                                "t.user.1@email.com",
                                function(opStatus3, user) {
                                    expect(opStatus3).to.be.equal(true);
                                    expect(user.email).to.be.equal("t.user.1@email.com",);
                                    expect(user.name).to.be.equal("User 1");
                                    expect(user.profilePic).to.be.equal("test_profilePic_1");
                                    expect(user.latestViewedNotification).to.be.equal("latestViewedNotification_1");
                                    
                                    // Find all
                                    userPersistence.findAll(
                                        function(opStatus4, users) {
                                            expect(opStatus4).to.be.equal(true);
                                            expect(users.length).to.be.above(1);

                                            // Delete
                                            userPersistence.deleteUser(
                                                "t.user.1@email.com",
                                                function(opStatus5) {
                                                    expect(opStatus5).to.equal(true);

                                                    userPersistence.deleteUser(
                                                        "t.user.2@email.com",
                                                        function(opStatus6) {
                                                            expect(opStatus6).to.equal(true);
        
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

    describe("CRUD Notification", function() {
        this.timeout(10000);

        // TODO: Start using Promises
        it("Should upsert, find and delete Notifications", function(done) {
            // Upsert 1
            notificationPersistence.upsertNotification(
                "title_1",
                "scheduleTime_1",
                "body_1",
                "dueDate_1",
                function(opStatus1) {
                    expect(opStatus1).to.be.equal(true);

                    // Upsert 2
                    notificationPersistence.upsertNotification(
                        "title_2",
                        "scheduleTime_2",
                        "body_2",
                        "dueDate_2",
                        function(opStatus2) {
                            expect(opStatus2).to.be.equal(true);

                            // Find one
                            notificationPersistence.findNotification(
                                "title_1",
                                "scheduleTime_1",
                                function(opStatus3, notification) {
                                    expect(opStatus3).to.be.equal(true);
                                    expect(notification.title).to.be.equal("title_1");
                                    expect(notification.body).to.be.equal("body_1");
                                    expect(notification.scheduleTime).to.be.equal("scheduleTime_1");
                                    expect(notification.dueDate).to.be.equal("dueDate_1");
                                    
                                    // Find all
                                    notificationPersistence.findAll(
                                        function(opStatus4, notifications) {
                                            expect(opStatus4).to.be.equal(true);
                                            expect(notifications.length).to.be.above(1);

                                            // Delete
                                            notificationPersistence.deleteNotification(
                                                "title_1",
                                                "scheduleTime_1",
                                                function(opStatus5) {
                                                    expect(opStatus5).to.equal(true);

                                                    notificationPersistence.deleteNotification(
                                                        "title_2",
                                                        "scheduleTime_2",
                                                        function(opStatus6) {
                                                            expect(opStatus6).to.equal(true);
        
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

    describe("CRUD UserNotification", function() {
        this.timeout(10000);

        // TODO: Start using Promises
        it("Should upsert, find and delete UserNotifications", function(done) {

            userPersistence.upsertUser(
                "t.user.1@email.com",
                "User 1", 
                "test_profilePic_1", 
                "latestViewedNotification_1",
                function(opStatus1) {
                    expect(opStatus1).to.be.equal(true);

                    notificationPersistence.upsertNotification(
                        "title_1",
                        "scheduleTime_1",
                        "body_1",
                        "dueDate_1",
                        function(opStatus2) {
                            expect(opStatus2).to.be.equal(true);
        
                            userPersistence.findUser(
                                "t.user.1@email.com",
                                function(opStatus3, user) {
                                    expect(opStatus3).to.be.equal(true);
                                    expect(user.email).to.be.equal("t.user.1@email.com",);
                                    expect(user.name).to.be.equal("User 1");
                                    expect(user.profilePic).to.be.equal("test_profilePic_1");
                                    expect(user.latestViewedNotification).to.be.equal("latestViewedNotification_1");

                                    notificationPersistence.findNotification(
                                        "title_1",
                                        "scheduleTime_1",
                                        function(opStatus4, notification) {
                                            expect(opStatus4).to.be.equal(true);
                                            expect(notification.title).to.be.equal("title_1");
                                            expect(notification.body).to.be.equal("body_1");
                                            expect(notification.scheduleTime).to.be.equal("scheduleTime_1");
                                            expect(notification.dueDate).to.be.equal("dueDate_1");

                                            userNotificationPersistence.upsertUserNotification(
                                                user,
                                                notification,
                                                function(opStatus5) {
                                                    expect(opStatus5).to.be.equal(true);

                                                    userNotificationPersistence.findUserNotification(
                                                        user.firebaseUid,
                                                        notification.firebaseUid,
                                                        function(opStatus6, userNotification) {
                                                            expect(opStatus6).to.be.equal(true);
                                                            expect(userNotification.user.email).to.be.equal(user.email);
                                                            expect(userNotification.notification.title).to.be.equal(notification.title);
                                                            
                                                            userNotificationPersistence.findAll(
                                                                user,
                                                                function(opStatus7, userNotifications) {
                                                                    expect(opStatus7).to.be.equal(true);
                                                                    expect(userNotifications.length).to.be.above(0);

                                                                    userNotificationPersistence.deleteUserNotification(
                                                                        user.firebaseUid,
                                                                        notification.firebaseUid,
                                                                        function(opStatus8) {
                                                                            expect(opStatus8).to.equal(true);

                                                                            userPersistence.deleteUser(
                                                                                "t.user.1@email.com",
                                                                                function(opStatus9) {
                                                                                    expect(opStatus9).to.equal(true);
                                
                                                                                    notificationPersistence.deleteNotification(
                                                                                        "title_1",
                                                                                        "scheduleTime_1",
                                                                                        function(opStatus10) {
                                                                                            expect(opStatus10).to.equal(true);
                                        
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