import { IncomingMessage, ServerResponse } from 'http';
import{parse as parseUUID} from 'uuid' ;

export function validateUUID(uuidString: string): boolean {
    try {
        parseUUID(uuidString);
        return true;
    } catch (error) {
      console.error('Invalid UUID string:', uuidString);
      return false;
    }
  }


export function parseRequestBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = '';
  
      // Listen for data chunks and append to the 'data' variable
      req.on('data', (chunk) => {
        data += chunk;
      });
  
      // When all data chunks are received
      req.on('end', () => {
        try {
          // Parse the data as JSON
          const body = JSON.parse(data);
          
          // Resolve with the parsed body
          resolve(body);
        } catch (error) {
          // Reject with the error
          reject(error);
        }
      });
  
      // Error handling for request
      req.on('error', (error) => {
        reject(error);
      });
    });
  }