/* perform replaces to ensure correct xml */
const escapeXML = (query) => {
  query = query.replace(/</g, '&lt;');
  query = query.replace(/>/g, '&gt');
  return query;
};

module.exports = { escapeXML };
