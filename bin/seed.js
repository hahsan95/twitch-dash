'use strict'

const db = require('../server/db')
const { Module } = require('../server/db/models')
const moduleData = require('./data/modules.json')

const seed = async () => {

  await db.sync({ force: true })

  // Create sequentially so auto-increment IDs match the order in
  // modules.json (client/allModules.js registers components by ID).
  for (const mData of moduleData) {
    await Module.create({...mData})
  }

  console.log(`
    Seeding of Modules table successful!
  `)

  db.close()
}

seed().catch(error => {
  db.close()
  console.log(`

    Something unintended occurred while seeding:

    ${error.message}

    ${error.stack}

  `)
})
