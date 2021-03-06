/* eslint-disable no-console */
/* eslint-disable camelcase */
/**
 * REQUIREMENT.
 * Create a .env file for 'pcypher' in the root directory of your project.
 * Add environment-specific variables on new lines in the form of NAME=VALUE.
 * For example:
    # environment sample content

    SECRET_KEY=InputRandomKeyHere
    KEY_LENGTH=16

    [TODO]
 * Handle proper error sending depending on the operation done.
*/


const { hasher, comparePassword } = require('pcypher');
const jwt = require('jsonwebtoken');
const validate = require('validator');
const { pool } = require('../database/database');

exports.signup = (req, res, next) => {
  (async () => {
    try {
      // Hashing
      const plainTextPassword = req.body.user_password;
      const password = hasher(plainTextPassword).then((result) => result).catch(
        (error) => error,
      );
      // null and undefined checker.
      if (!password) return;
      // console.log(password);
      const data = {
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email,
        userPassword: password,
        gender: req.body.gender,
        jobRole: req.body.job_role,
        department: req.body.department,
        userRole: req.body.role,
        userAddress: req.body.user_address,
        createdOn: Date(Date.now()).toString(),
      };
      const getUserId = async () => {
        const email = [req.body.email];
        pool.query('SELECT user_id FROM employeeDetails WHERE email = $1;', email).then(
          (user) => {
            const accessToken = jwt.sign({ userId: user.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.status(201).json({
              status: 'success',
              data: {
                message: 'Congratulation you have created a new user',
                token: accessToken,
                userId: Number(user.rows[0].user_id),
              },
            });
          },
        ).catch(
          (error) => {
            res.status(500).json({
              status: 'Internal Server Error',
              data: {
                name: error.name,
                code: error.code,
                detail: error.detail,
                stack: error.stack,
              },
            });
          },
        );
      };
      // Querying Database.
      const text = 'INSERT INTO employeeDetails(firstName, lastName, email, userpassword, gender, jobRole, department, userRole, userAddress, createdOn) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);';
      const values = Object.values(data); // Convert Object to Array
      pool.query(text, values).then(
        () => {
          getUserId(values);
        },
      ).catch(
        (error) => {
          res.status(400).json({
            message: {
              name: error.name,
              code: error.code,
              detail: error.detail,
              stack: error.stack,
            },
          });
        },
      );
    } catch (error) {
      next(error);
    }
  })();
};

exports.login = async (req, res, next) => {
  try {
    const { email, user_password } = req.body;
    if (!(validate.isEmail(email))) return;
    pool.query('SELECT user_id, email, userpassword, userRole FROM employeeDetails WHERE email = $1', [email]).then(
      (user) => {
        (async () => {
          try {
            // Password from request body
            const plainTextPassword = user_password;
            // console.log(plainTextPassword);
            // Return boolean true or false
            const comparison = (async () => {
              // Null and undefined check.
              if (!plainTextPassword) return;
              comparePassword(plainTextPassword, user.rows[0].userpassword).then(
                (result) => result,
              ).catch((error) => error);
            }
            )();
            console.log(comparison);
            if (!comparison) {
              return next(
                res.status(401).json({
                  message: 'Password is not correct',
                }),
              );
            }
            // Generating JWT token.
            const accessToken = jwt.sign({ userId: user.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.status(200).json({
              status: 'success',
              data: {
                token: accessToken,
                userId: Number(user.rows[0].user_id),
                role: user.rows[0].userrole,
              },
            });
          } catch (error) {
            next(error);
          }
        })();
      },
    ).catch(
      (error) => {
        res.status(401).json({
          message: 'Email does not exist or invalid Email',
          more: {
            name: error.name,
            code: error.code,
            detail: error.detail,
            stack: error.stack,
          },
        });
      },
    );
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {

  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {

  } catch (error) {
    next(error);
  }
};
