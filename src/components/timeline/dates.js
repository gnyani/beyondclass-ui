module.exports = [
  {
    date: new Date(),
  },
  {
    date: new Date(new Date().setDate(new Date().getDate()-1)),
  },
  {
    date: new Date(new Date().setDate(new Date().getDate()-2)),
  },
  {
    date: new Date(new Date().setDate(new Date().getDate()-3)),
  },
  {
    date: new Date(new Date().setDate(new Date().getDate()-4)),
  }
];
