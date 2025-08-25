import mongoose from 'mongoose';
import app from './app';
import { config } from './config/default';

async function start() {
  try {
    await mongoose.connect(config.mongoUri);
    app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend listening on http://localhost:${config.port}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

void start();


