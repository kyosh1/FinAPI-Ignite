const { response } = require("express");
const { v4: uuidv4 } = require("uuid");

const users = [];

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
      if (operation.type == "credit") {
        return acc + operation.amount;
      } else {
        return acc - operation.amount
      }
    }, 0)

    return balance;
}

module.exports = {
  async authMiddleware(req, res, next) {
    const { cpf } = req.headers;

    const user = users.find((user) => user.cpf === cpf);
    if (!user) 
        return res.status(400).json({ message: "User not found" });

    req.user = user;

    return next();
  },

  async register(req, res) {
    const { cpf, name } = req.body;

    if (users.some((user) => user.cpf === cpf))
      return res.status(400).json({ message: "User already exists." });

    users.push({
      id: uuidv4(),
      cpf,
      name,
      statement: [],
    });

    return res.status(201).send();
  },

  async statement(req, res) {
    const { user } = req;

    return res.json(user.statement);
  },

  async deposit(req, res) {
    const { user } = req;
    const { description, amount } = req.body;

    const depositStatementOptions = {
      description,
      amount,
      created_at: new Date(Date.now()),
      type: "credit",
    };

    user.statement.push(depositStatementOptions);

    return res.status(201).send();
  },

  async withdraw(req, res) {
    const { user } = req;
    const { amount } = req.body;

    const balance = getBalance(user.statement)

    if(balance < amount)
    return res.status(400).json({ message: "You don't have enough money for the withdrawal" })

    const withdrawStatementOptions = {
      amount,
      created_at: new Date(Date.now()),
      type: "debit",
    };

    user.statement.push(withdrawStatementOptions);

    return res.status(201).send();
  },

  async statementData(req, res) {
    const { user } = req;
    const { date } = req.query;

    const dateFormat = new Date(date + " 00:00");

    const statement = user.statement.filter(statement => statement.created_at.toDateString() === new Date(dateFormat).toDateString())

    return res.json(statement);
  },

  async account(req, res) {
      const { user } = req;
      const balance = getBalance(user.statement)

      return res.json({
          user,
          balance
      })
  },

  async updateAccount(req, res) {
      const { user } = req;
      const { name } = req.body;

      user.name = name;

      return res.status(201).send()
  },

  async deleteAccount(req, res) {
    const { user } = req; 

    const indexUser = users.findIndex(
        userIndex => userIndex.cpf === user.cpf);
    
    users.splice(indexUser, 1)

    return res.status(200).json(users)
  }
};
