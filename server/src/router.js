const router = require("express").Router();
const { query } = require("./database");

const toDateStrFormat = (dateStr) => {
    console.log("toDateStrFormat()");

    console.log("dateStr = " + dateStr);

    const [day, month, year] = dateStr.split("/");

    const dateFormat = year + "/" + month + "/" + day;

    console.log("dateFormat = " + dateFormat);

    return dateFormat;

}

const toDateStrFormatFixed = (dateStr) => {
    console.log("toDateStrFormatFixed()");

    console.log("dateStr = " + dateStr);

    const [day, month, year] = dateStr.split("/");

    let intDay = parseInt(day);
    intDay += 1;

    const dateFormat = year + "/" + month + "/" + intDay;

    console.log("dateFormat = " + dateFormat);

    return dateFormat;

}


//
// GET
//

router.get("/opportunities", (req, res) => {
    console.log("router.get() - opportunities");
    const queryString = "SELECT o.id, o.name, DATE_FORMAT(o.starting_date,'%d/%m/%Y') AS date, o.description, o.value, c.name AS company, o.companies_id AS companyId, s.status AS status, o.status_id AS statusId, " +
        "(SELECT COUNT(*) FROM interactions i WHERE i.opportunity_id=o.id) AS interactionsNumber " +
        "FROM opportunities AS o LEFT JOIN companies AS c ON o.companies_id = c.id " +
        "LEFT JOIN status AS s ON o.status_id = s.id";

    // SELECT o.id, o.name, DATE_FORMAT(o.starting_date,'%d/%m/%Y')AS date, o.value, o.description, c.name AS company, s.status AS status, o.status_id as statusId, (SELECT COUNT(*) FROM interactions i WHERE i.opportunity_id=o.id) AS intNumber FROM opportunities AS o LEFT JOIN companies AS c ON o.companies_id = c.id LEFT
    //JOIN status AS s ON o.status_id = s.id;

    console.log(queryString);

    query(queryString)
        // .then(results => res.json(results))
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/interactions", (req, res) => {
    console.log("router.get() - interactions");

    const queryString = `SELECT i.id, DATE_FORMAT(i.date,'%d/%m/%Y') AS date, i.description, it.type AS type, o.name AS opportunity, i.id AS opportunityId FROM interactions i ` +
        "LEFT JOIN opportunities AS o " +
        `ON i.opportunity_id=o.id ` +
        "LEFT JOIN interaction_type AS it ON i.type_id=it.id"

    // SELECT i.id, DATE_FORMAT(i.date,'%d/%m/%Y') AS date, i.description, it.type AS type, o.name AS opportunity, i.id AS opportunityId FROM interactions i LEFT JOIN opportunities AS o ON i.opportunity_id=o.id LEFT JOIN interaction_type AS it ON i.type_id=it.id;
    
    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()


router.get("/interactions/opportunity/:id", (req, res) => {
    console.log("router.get() - interactions/opportunity/:id");

    const queryString = `SELECT i.id, DATE_FORMAT(i.date,'%d/%m/%Y') AS date, i.description, it.type AS type FROM interactions i ` +
        "LEFT JOIN interaction_type AS it ON i.type_id=it.id " +
        `WHERE i.opportunity_id=${req.params.id} `

    // SELECT i.id, DATE_FORMAT(i.date,'%d/%m/%Y') AS date, i.description, it.type AS type FROM interactions i LEFT JOIN interaction_type AS it ON i.type_id=it.id WHERE i.opportunity_id=29;
    
    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/opportunities/:id/interactions/Id", (req, res) => {
    console.log("router.get() - /opportunities/:id/interactions/Id");

    const queryString = `SELECT MAX(id) AS maxId FROM interactions ` +
        " " +
        `WHERE opportunity_id=${req.params.id} `

    // SELECT i.id, DATE_FORMAT(i.date,'%d/%m/%Y') AS date, i.description, it.type AS type FROM interactions i LEFT JOIN interaction_type AS it ON i.type_id=it.id WHERE i.opportunity_id=29;

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/contacts", (req, res) => {
    console.log("router.get() - /contacts");

    const queryString = "SELECT c.id, c.first_name AS 'First Name', c.last_name AS 'Last Name', c.role AS 'Role', comp.name AS 'Company' " +
        "FROM contacts AS c " +
        "LEFT JOIN companies AS comp ON c.company_id=comp.id";

    // SELECT c.id, c.name, c.VAT, c.revenues, c.employees, s.sector from companies AS c LEFT JOIN sectors AS s ON c.sector_id=s.id;

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/contacts/interaction/:id", (req, res) => {
    console.log("router.get() - contacts/interaction");

    const queryString = "SELECT c.id, c.first_name AS firstName, c.last_name AS lastName, c.role FROM contacts_has_interactions ci " +
        "LEFT JOIN contacts c ON c.id = ci.contacts_id " +
        `WHERE ci.interactions_id=${req.params.id} `

    // SELECT c.id, c.first_name, c.last_name, c.role FROM contacts_has_interactions ci LEFT JOIN contacts c ON c.id = ci.contacts_id WHERE ci.interactions_id=3;
   
    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/contacts/:id", (req, res) => {
    console.log("router.get() - contacts/:id");

    const queryString = "SELECT c.id, c.first_name AS firstName, c.last_name AS lastName, c.role, c.email, c.phone, c.confidence_level AS confidenceLevel, c.notes, c.manager_id AS managerId, c.company_id AS companyId, comp.name AS company " +
        "FROM contacts c " +
        "LEFT JOIN companies comp ON c.company_id=comp.id " +
        `WHERE c.id=${req.params.id} `
    // SELECT c.first_name AS firstName, c.last_name AS lastName, c.role, c.email, c.phone, c.confidence_level AS confLevel, c.notes, c.manager_id AS managerId, c.company_id, comp.name AS company FROM contacts c LEFT JOIN companies comp ON c.company_id=comp.id WHERE c.id=3;

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/companies/:id", (req, res) => {
    console.log("router.get() - companies/:id");

    const queryString = "SELECT c.id, c.name, c.VAT, c.revenues, c.employees, c.sector_id AS sectorId, s.sector " +
        "FROM companies c " +
        "LEFT JOIN sectors s ON c.sector_id=s.id " +
        `WHERE c.id=${req.params.id} `

    // SELECT c.id, c.name, c.VAT, c.revenues, c.employees, c.sector_id AS sectorId, s.sector FROM companies c LEFT JOIN sectors s ON c.sector_id=s.id WHERE c.id=1;

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/companies", (req, res) => {
    console.log("router.get() - /companies");
    // const queryString = "SELECT id, name " +
    //     "FROM companies ";
    
    const queryString = "SELECT c.id, c.name, c.VAT, s.sector " +
        "FROM companies AS c " +
        "LEFT JOIN sectors AS s ON c.sector_id=s.id";
    
    // SELECT c.id, c.name, c.VAT, c.revenues, c.employees, s.sector from companies AS c LEFT JOIN sectors AS s ON c.sector_id=s.id;

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/companies/:id/contacts", (req, res) => {
    console.log("router.get() - /companies/:id/contacts");
    const queryString = "SELECT id, first_name AS firstName, last_name AS lastName, role FROM contacts " +
        `WHERE company_id=${req.params.id} `;

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/companies/new/Id", (req, res) => {
    console.log("router.get() - /companies/new/Id");

    const queryString = `SELECT MAX(id) AS maxId FROM companies `

    console.log(queryString);

    query(queryString)
        .then(results => {
            console.log("^^^^^^ router.get(/companies/new/Id) - results = " + JSON.stringify(results));
            return res.send(results);
        })
        .catch((err) => {
            console.log("ERROR in router.get(/companies/Id)" + err);
            res.json({});
        })
}) // router.get()

router.get("/opportunities/companies/:id", (req, res) => {
    console.log("router.get() - /opportunities/companies/Id");

    const queryString = `SELECT COUNT(*) AS oppsNum FROM opportunities WHERE companies_id=${req.params.id} `

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/interactions/contacts/:id", (req, res) => {
    console.log("router.get() - /interactions/contacts/Id");

    const queryString = `SELECT COUNT(*) AS intsNum FROM contacts_has_interactions WHERE contacts_id=${req.params.id} `

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/contacts/new/Id", (req, res) => {
    console.log("router.get() - /contacts/new/Id");

    const queryString = `SELECT MAX(id) AS maxId FROM contacts `

    console.log(queryString);

    query(queryString)
        .then(results => {
            console.log("^^^^^^ router.get(/contacts/new/Id) - results = " + JSON.stringify(results));
            return res.send(results);
        })
        .catch((err) => {
            console.log("ERROR in router.get(/contacts/Id)" + err);
            res.json({});
        })
}) // router.get()

router.get("/statuses", (req, res) => {
    console.log("router.get() - /statuses");
    const queryString = "SELECT id, status " +
        "FROM status ";

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/sectors", (req, res) => {
    console.log("router.get() - /sectors");
    const queryString = "SELECT id, sector " +
        "FROM sectors ";

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/sectors/:id/companies", (req, res) => {
    console.log("router.get() - /sectors/:id/companies");
    const queryString = "SELECT name FROM companies " +
        `WHERE sector_id=${req.params.id} `;

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/types", (req, res) => {
    console.log("router.get() - /types");
    const queryString = "SELECT id, type " +
        "FROM interaction_type ";
    
    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()

router.get("/statuses/severities", (req, res) => {
    console.log("router.get()");
    const queryString = "SELECT id, status, severity " +
        "FROM status ";

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()


router.get("/companies/:id/addresses", (req, res) => {
    console.log("router.get() - /companies/:id/addresses");

    const queryString = "SELECT ca.addresses_id AS addressId, a.* " +
        "FROM companies_has_addresses ca " +
        "LEFT JOIN addresses a ON ca.addresses_id=a.id " +
        `WHERE ca.companies_id=${req.params.id} `

    // SELECT ca.addresses_id AS addressId, a.* FROM companies_has_addresses ca LEFT JOIN addresses a ON ca.addresses_id=a.id WHERE ca.companies_id=1;
    console.log(queryString);
    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()


router.get("/statuses/:status/severities", (req, res) => {
    console.log("router.get() - statuses/:id/severities");

    const queryString = "SELECT severity FROM status " +
        `WHERE status="${req.params.status}" `

    console.log(queryString);
    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()


//
// POST
//

router.post("/opportunities", (req, res) => {
    console.log("router.post() - /opportunities");

    const { name, date, description, value, company } = req.body;

    const queryString = `
        INSERT INTO opportunities (name, starting_date, description, value, companies_id) 
        VALUES (${name ? `'${name}'` : null}, STR_TO_DATE("${date}", "%d/%m/%Y"), '${description || ''}', '${value || 0}', '${company}');
    `
    console.log(queryString);

    query(queryString)
        .then((result) => res.json(result))
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Failed to add an event" })
        })

}) // router.post()

router.post("/interactions", (req, res) => {
    console.log("router.post() - /interactions");

    const { id, date, description, type, opportunity } = req.body;

    const queryString = `
        INSERT INTO interactions (date, description, type_id, opportunity_id) 
        VALUES (STR_TO_DATE("${date}", "%d/%m/%Y"), '${description || ''}', '${type || 1}', '${opportunity}');
    `
    console.log(queryString);

    query(queryString)
        .then((result) => res.json(result))
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Failed to add an event" })
        })

}) // router.post()


router.post("/interactions/:id/contacts", (req, res) => {
    console.log("router.post() - /interactions:id/contacts");

    let queryString = `
            INSERT INTO contacts_has_interactions (contacts_id, interactions_id)
            VALUES `;

    if (req.body.length > 0) {
        req.body.forEach(contObj => {
            queryString += `(${contObj.contactsId}, ${req.params.id}), `
        });

        queryString = queryString.slice(0, -2);

        console.log(queryString);

        query(queryString)
            .then((result) => res.json(result))
            .catch((err) => {
                console.log(err);
                res.status(400).json({ error: "Failed to add an event" })
            })
    } else {
        return res.status(400).json({ error: "Failed to add an event" });
    }

}) // router.post()

router.post("/sectors", (req, res) => {
    console.log("router.post() - /sectors");

    const { sector } = req.body;

    const queryString = `
        INSERT INTO sectors (sector) 
        VALUES ('${sector}');
    `
    console.log(queryString);

    query(queryString)
        .then((result) => res.json(result))
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Failed to add an event" })
        })

}) // router.post()

router.post("/addresses", (req, res) => {
    console.log("router.post() - /addresses");

    const { fullAddress, street, number, zip, city, state, country, description, LAT, LNG } = req.body;

    const queryString = `
        INSERT INTO addresses ( fullAddress, street, number, zip, city, state, country, description, LAT, LNG )
        VALUES ( "${fullAddress}", "${street}", "${number}", "${zip}", "${city}", "${state}", "${country}", "${description}", ${LAT}, ${LNG});
    `
    console.log(queryString);

    query(queryString)
        .then((result) => res.json(result))
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Failed to add an event" })
        })

}) // router.post()

router.post("/companies", (req, res) => {
    console.log("router.post() - /companies");

    const { id, name, VAT, revenues, employees, sectorId } = req.body;

    const queryString = `
        INSERT INTO companies (id, name, VAT, revenues, employees, sector_id)
        VALUES ( ${id}, "${name}", "${VAT}", ${revenues}, ${employees}, ${sectorId} );
    `
    console.log(queryString);

    query(queryString)
        .then((result) => res.json(result))
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Failed to add an event" })
        })

}) // router.post()

router.post("/companies/:id/addresses", (req, res) => {
    console.log("router.post() - /companies/:id/addresses");

    let queryString = `
            INSERT INTO companies_has_addresses (companies_id, addresses_id)
            VALUES (${req.params.id}, ${req.body.id})`;

        console.log(queryString);

        query(queryString)
            .then((result) => res.json(result))
            .catch((err) => {
                console.log(err);
                res.status(400).json({ error: "Failed to add an event" })
            })

}) // router.post()

router.post("/contacts", (req, res) => {
    console.log("router.post() - /contacts");

    const { id, firstName, lastName, role, companyId, email, phone, confidenceLevel, notes } = req.body;

    const queryString = `
        INSERT INTO contacts (id, first_name, last_name, role, company_id, phone, email, confidence_level, notes )
        VALUES ( ${id}, "${firstName}", "${lastName}", "${role}", ${companyId}, "${phone}", "${email}", "${confidenceLevel}", "${notes}" );
    `
    console.log(queryString);

    query(queryString)
        .then((result) => res.json(result))
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Failed to add an event" })
        })

}) // router.post()


//
// PUT
//
router.put("/opportunities/:id", (req, res) => {
    console.log("router.put() - /opportunities/:id");

    const { id, name, date, status, value, company } = req.body;

    console.log(req.body);

    const queryString = `
        UPDATE opportunities
        SET name = '${name}', starting_date = STR_TO_DATE("${date}", "%d/%m/%Y"), value = ${value}, companies_id = ${company}, status_id = ${status}
        WHERE id = ${id}
    `
    console.log(queryString);

    query(queryString)
        .then(() => res.json(req.body))
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Failed to edit an event" })
        })

}) // router.put()

router.put("/interactions/:id", (req, res) => {
    console.log("router.put() - /interactions/:id");

    const { id, date, description, type } = req.body;

    console.log(req.body);

    const queryString = `
        UPDATE interactions
        SET date = STR_TO_DATE("${date}", "%d/%m/%Y"), description = "${description}", type_id = ${type}
        WHERE id = ${id}
    `
    console.log(queryString);

    query(queryString)
        .then(() => res.json(req.body))
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Failed to edit an event" })
        })

}) // router.put()

router.put("/sectors/:id", (req, res) => {
    console.log("router.put() - /sectors/:id");

    const { id, sector } = req.body;

    console.log(req.body);

    const queryString = `
        UPDATE sectors 
        SET sector = "${sector}" 
        WHERE id = ${id}
    `
    console.log(queryString);

    query(queryString)
        .then(() => res.json(req.body))
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Failed to edit an event" })
        })

}) // router.put()

router.put("/companies/:id", (req, res) => {
    console.log("router.put() - /companies/:id");

    const { id, name, VAT, employees, revenues, sectorId } = req.body;

    console.log(req.body);

    const queryString = `
        UPDATE companies
        SET name = '${name}', VAT = '${VAT}', employees = ${employees}, revenues = ${revenues}, sector_id = ${sectorId}
        WHERE id = ${id}
    `
    console.log(queryString);

    query(queryString)
        .then(() => res.json(req.body))
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Failed to edit an event" })
        })

}) // router.put()

router.put("/contacts/:id", (req, res) => {
    console.log("router.put() - /contacts/:id");

    const { id, firstName, lastName, role, companyId, email, phone, confidenceLevel, notes } = req.body;

    console.log(req.body);

    const queryString = `
        UPDATE contacts
        SET first_name = '${firstName}', last_name = '${lastName}', role = '${role}', company_id = ${companyId}, email = '${email}', phone = '${phone}', confidence_level = '${confidenceLevel}', notes = '${notes}'
        WHERE id = ${id}
    `
    console.log(queryString);

    query(queryString)
        .then(() => res.json(req.body))
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Failed to edit an event" })
        })

}) // router.put()


//
// DELETE 
//
router.delete("/opportunities/:id", (req, res) => {
    const { name } = req.body;

    console.log("router.delete()");
    console.log("req.params.id = " + req.params.id);

    query(`DELETE FROM opportunities WHERE id = ${req.params.id}`)
        .then(() => res.send(true))
        .catch((err) => {
            console.log(err);
            res.status(400).send(false)
        })
}) // router.delete() 

router.delete("/interactions/:id", (req, res) => {
    console.log("router.delete() - /interactions/:id");

    query(`DELETE FROM interactions WHERE id = ${req.params.id}`)
        .then(() => res.send(true))
        .catch((err) => {
            console.log(err);
            res.status(400).send(false)
        })
    
}) // router.delete()

router.delete("/sectors/:id", (req, res) => {
    console.log("router.delete() - /sectors/:id");

    query(`DELETE FROM sectors WHERE id = ${req.params.id}`)
        .then(() => res.send(true))
        .catch((err) => {
            console.log(err);
            res.status(400).send(false)
        })
    
}) // router.delete()


router.delete("/companies/:id", (req, res) => {
    console.log("router.delete(companies/:id)");

    query(`DELETE FROM companies WHERE id = ${req.params.id}`)
        .then(() => res.send(true))
        .catch((err) => {
            console.log(err);
            res.status(400).send(false)
        })
    
}) // router.delete()


router.delete("/addresses/:id", (req, res) => {
    console.log("router.delete(addresses/:id");
    console.log("req.params.id = " + req.params.id);

    query(`DELETE FROM addresses WHERE id = ${req.params.id}`)
        .then(() => res.send(true))
        .catch((err) => {
            console.log(err);
            res.status(400).send(false)
        })
    
}) // router.delete()

router.delete("/contacts/:id", (req, res) => {
    console.log("router.delete() - /contacts/:id");

    query(`DELETE FROM contacts WHERE id = ${req.params.id}`)
        .then(() => res.send(true))
        .catch((err) => {
            console.log(err);
            res.status(400).send(false)
        })

}) // router.delete()

//
// GET - REPORTS
//

router.get("/reports/opportunities/general", (req, res) => {
    console.log("router.get() - /reports/opportunities/general");

    const queryString = `
        SELECT
        SUM(CASE WHEN status_id = 4 THEN 1 ELSE 0 END) AS statusWonCount,
        SUM(CASE WHEN status_id = 3 THEN 1 ELSE 0 END) AS statusLostCount,
        COUNT(*) - SUM(CASE WHEN status_id IN(3, 4) THEN 1 ELSE 0 END) AS statusOpenCount
        FROM opportunities;
    `

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()
    
router.get("/reports/opportunities/detailed", (req, res) => {
    console.log("router.get() - /reports/opportunities/detailed");

    const queryString = `
        SELECT s.status, COUNT(*) AS count FROM opportunities o
        LEFT JOIN status s ON o.status_id=s.id 
        GROUP BY o.status_id;
    `

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()
    
router.get("/reports/opportunities/sectors", (req, res) => {
    console.log("router.get() - /reports/opportunities/sectors");

    const queryString = `
        SELECT c.sector_id, s.sector,
            SUM(CASE WHEN o.status_id = 4 THEN o.value ELSE 0 END) AS statusWonSum,
            SUM(CASE WHEN o.status_id = 3 THEN o.value ELSE 0 END) AS statusLostSum,
            SUM(CASE WHEN o.status_id NOT IN (3, 4) THEN o.value ELSE 0 END) AS statusOpenSum
            FROM companies c
            LEFT JOIN opportunities o ON c.id = o.companies_id
            LEFT JOIN sectors s ON c.sector_id=s.id
            GROUP BY c.sector_id
        `

    console.log(queryString);

    query(queryString)
        .then(results => res.send(results))
        .catch((err) => {
            console.log(err);
            res.json({});
        })
}) // router.get()



module.exports = router;