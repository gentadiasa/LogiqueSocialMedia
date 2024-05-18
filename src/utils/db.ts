import SQLite from 'react-native-sqlite-storage';
import { Friend, Post, } from '../types';

const db = SQLite.openDatabase(
    { name: 'socialmedia.db', location: 'default' },
    () => { },
    error => {
        console.error(error);
    }
);

export const createTables = () => {
    db.transaction(txn => {
        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS friends (
        id TEXT PRIMARY KEY,
        firstName TEXT,
        lastName TEXT
      )`,
            [],
            () => { },
            error => {
                console.error(error);
            }
        );
        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS likes (
        id TEXT PRIMARY KEY,
        data TEXT
      )`,
            [],
            () => { },
            error => {
                console.error(error);
            }
        );
    });
};

export const addFriendToDB = (id: string, firstName: string, lastName: string) => {
    db.transaction(txn => {
        txn.executeSql(
            `INSERT INTO friends (id, firstName, lastName) VALUES (?, ?, ?)`,
            [id, firstName, lastName],
            () => { },
            error => {
                console.error(error);
            }
        );
    });
};

export const removeFriendFromDB = (id: string) => {
    db.transaction(txn => {
        txn.executeSql(
            `DELETE FROM friends WHERE id = ?`,
            [id],
            () => { },
            error => {
                console.error(error);
            }
        );
    });
};

export const addLikeToDB = (post: Post) => {
    db.transaction(txn => {
        txn.executeSql(
            `INSERT INTO likes (id, data) VALUES (?, ?)`,
            [post.id, JSON.stringify(post)],
            () => { },
            error => {
                console.error(error);
            }
        );
    });
};

export const removeLikeFromDB = (id: string) => {
    db.transaction(txn => {
        txn.executeSql(
            `DELETE FROM likes WHERE id = ?`,
            [id],
            () => { },
            error => {
                console.error(error);
            }
        );
    });
};

export const getLikesFromDB = (): Promise<Post[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM likes`,
                [],
                (tx, results) => {
                    const rows = results.rows;
                    let likes: Post[] = [];
                    for (let i = 0; i < rows.length; i++) {
                        likes.push(JSON.parse(rows.item(i).data));
                    }
                    resolve(likes);
                },
                error => {
                    reject(error);
                }
            );
        });
    });
};

export const getFriendsFromDB = (): Promise<Friend[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM friends`,
                [],
                (tx, results) => {
                    const rows = results.rows;
                    let friends: Friend[] = [];
                    for (let i = 0; i < rows.length; i++) {
                        friends.push(rows.item(i));
                    }
                    resolve(friends);
                },
                error => {
                    reject(error);
                }
            );
        });
    });
};
