export const create = (obj_type, obj_name, ...args) => {
  obj_type = obj_type.toUpperCase();
  let statement = `CREATE ${obj_type} ${obj_name}`;
  switch (obj_type) {
    case "TABLE":
      const [columns, fourth, fifth] = args;
      statement += ` (`;

      for (const column of columns) {
        if (column.constraints === undefined) {
          statement += `\n ${column.column_name} ${column.data_type},`;
          continue;
        }

        statement += `\n ${column.column_name} ${column.data_type} ${column.constraints.join(" ")},`;
      }

      if (fourth && fifth) {
        statement += `\n PRIMARY KEY (${fourth.fields.join(", ")}),`;
        statement += `\n UNIQUE (${fifth.fields.join(", ")}),`;
      }

      if (fourth && !fifth) {
        if (fourth.type === "comp_key") {
          statement += `\n PRIMARY KEY (${fourth.fields.join(", ")}),`;
        }

        if (fourth.type === "comp_uniq") {
          statement += `\n UNIQUE (${fourth.fields.join(", ")}),`;
        }
      }

      statement = statement.slice(0, -1);
      statement += `\n)`;
      break;

    case "SEQUENCE":
      break;

    case "DATABASE":
      const [options] = args;
      const {
        owner,
        template,
        encoding,
        lcc_collate,
        lcc_ctype,
        tablespace,
        conn_limit,
      } = options;
      if (owner) {
        statement += `\nOWNER = ${owner}`;
      }

      if (template) {
        statement += `\nTEMPLATE = ${template}`;
      }

      if (encoding) {
        statement += `\nENCODING = ${encoding}`;
      }

      if (lcc_collate) {
        statement += `\nLCC_COLLATE = ${lcc_collate}`;
      }

      if (lcc_ctype) {
        statement += `\nLCC_CTYPE = ${lcc_ctype}`;
      }

      if (tablespace) {
        statement += `\nTABLESPACE = ${tablespace}`;
      }

      if (conn_limit) {
        statement += `\nCONNECTION LIMIT = ${conn_limit}`;
      }
      break;

    case "TRIGGER":
      break;

    case "FUNCTION":
      const [param_list, return_type, language] = args;
      statement += `(${param_list.join(', ')}) \nRETURNS ${return_type} \nLANGUAGE ${language} \nAS`;
      break;

    case "STORED PROCEDURE":
      break;

    case "VIEW":
      const [view_table, view_cols, view_clauses, joins, aggregates] = args;
      statement += ` AS \n${select(
        view_table,
        view_cols,
        view_clauses,
        joins,
        aggregates
      )}`.slice(0, -1);
      break;

    case "INDEX":
      const [ind_table_name, ind_cols] = args;
      statement += ` ON ${ind_table_name} (${ind_cols.join(", ")})`;
      break;

    default:
  }

  statement += ";";
  return statement;
};

export const insert = (rows_count, table_name, columns_name_and_type) => {
  let statement = "";
  const cols_name = [];
  const types = [];
  const nullCounts = [];
  let rows = [];

  const names = ["Ishaq", "Jamal", "Saoban", "Dare"];
  const emails = generateUniqueEmails(rows_count);
  const phone_number = generateUniquePhoneNumbers(rows_count);

  columns_name_and_type.forEach((item) => {
    cols_name.push(item.name);
    types.push(item.type);
    const nullCount = Math.round((item.blankPercentage / 100) * rows_count);
    nullCounts.push(nullCount);
  });
  const nullDistributions = nullCounts.map((count) => {
    const distribution = Array(rows_count).fill(false);
    for (let i = 0; i < count; i++) {
      let index;
      do {
        index = Math.floor(Math.random() * rows_count);
      } while (distribution[index]);
      distribution[index] = true;
    }
    return distribution;
  });

  for (let i = 1; i <= rows_count; i++) {
    const values = types.map((item, index) => {
      if (nullDistributions[index][i]) {
        return "NULL";
      }

      if (item === "email") {
        return `'${emails[Math.floor(Math.random() * emails.length)]}'`;
      }

      if (item === "name") {
        return `'${names[Math.floor(Math.random() * names.length)]}'`;
      }

      if (item === "phone_number") {
        return `'${
          phone_number[Math.floor(Math.random() * phone_number.length)]
        }'`;
      }

      if (item === "integer") {
        return Math.floor(Math.random() * 100);
      }

      return `'${item}'`;
    });

    rows.push(values);
  }

  statement = rows.map(
    (item) =>
      `INSERT INTO ${table_name} (${cols_name.join(", ")}) VALUES (${item.join(
        ", "
      )})`
  );

  statement = statement.join(";\n");
  statement += ";";
  return statement;
};

export function select(table_name, columns, clauses, joins, aggregates) {
  const {
    where_only,
    and,
    or,
    between,
    limit,
    fetch,
    order_by,
    group_by,
    offset,
  } = clauses;
  let statement = `SELECT ${columns === "all" ? "*" : columns.join(", ")}`;

  if (aggregates && aggregates.length > 0) {
    const aggregateClauses = aggregates.map(
      (agg) => `${agg.function}(${agg.column}) AS ${agg.alias}`
    );
    statement += `, ${aggregateClauses.join(", ")}`;
  }

  statement += ` FROM ${table_name}`;

  if (joins && joins.length > 0) {
    joins.forEach((join) => {
      statement += `\n${join.type} JOIN ${join.table} AS ${join.alias} ON ${join.condition}`;
    });
  }

  if (where_only?.status) {
    statement += `\nWHERE ${where_only.condition}`;
  }
  if (and?.status) {
    statement += `\nWHERE ${and.conditions.join(" AND ")}`;
  }
  if (or?.status) {
    statement += `\nWHERE ${or.conditions.join(" OR ")}`;
  }
  if (between?.status) {
    statement += `\nWHERE ${between.conditions.join(" BETWEEN ")}`;
  }

  if (group_by?.status) {
    statement += `\nGROUP BY ${group_by.columns.join(", ")}`;
    if (group_by?.having?.status) {
      statement += `\nHAVING ${group_by.having.condition}`;
    }
  }

  if (order_by?.status) {
    const orderByClauses = order_by.columns.map(
      (column, index) => `${column} ${order_by.orders[index]}`
    );
    statement += `\nORDER BY ${orderByClauses.join(", ")}`;
  }

  if (limit?.status) {
    statement += `\nLIMIT ${limit.amount}`;
  }

  if (offset?.status) {
    statement += `\nOFFSET ${offset.amount}`;
  }

  if (fetch?.status) {
    statement += `\nFETCH ${fetch.option} ${fetch.amount} ROWS ONLY`;
  }

  statement += ";";
  return statement;
}

function generateUniqueEmails(n) {
  const domains = ["gmail.com", "yahoo.com", "outlook.com"];
  const emails = new Set();

  while (emails.size < n) {
    const randomLength = Math.floor(Math.random() * (15 - 8 + 1)) + 8;
    const username = generateRandomString(randomLength);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const email = `${username}@${domain}`;
    emails.add(email);
  }

  return Array.from(emails);
}

function generateRandomString(length) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateUniquePhoneNumbers(n) {
  const countryCodes = ["+1", "+44", "+91", "+61", "+81"]; // Example country codes (US, UK, India, Australia, Japan)
  const phoneNumbers = new Set();

  while (phoneNumbers.size < n) {
    const countryCode =
      countryCodes[Math.floor(Math.random() * countryCodes.length)];
    const phoneNumber = generateRandomPhoneNumber();
    const fullNumber = `${countryCode}${phoneNumber}`;
    phoneNumbers.add(fullNumber);
  }

  return Array.from(phoneNumbers);
}

function generateRandomPhoneNumber() {
  const digits = "0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    // Assuming a 10-digit phone number
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return result;
}
