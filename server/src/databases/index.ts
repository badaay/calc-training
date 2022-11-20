import { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } from '@config';

export const dbConnection = {
  url: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}?retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
};
