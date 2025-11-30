// SocketService for managing Socket.IO events
import LoggerService from './LoggerService.js';

class SocketService {
  static #io = null;

  // Initialize the Socket.IO instance
  static initialize(io) {
    SocketService.#io = io;
    LoggerService.info('SocketService initialized');
  }

  // Get the Socket.IO instance
  static getIO() {
    if (!SocketService.#io) {
      LoggerService.warn('SocketService not initialized');
    }
    return SocketService.#io;
  }

  // Emit customer-added event
  static emitCustomerAdded(data) {
    const io = SocketService.getIO();
    if (io) {
      io.emit('customer-added', {
        message: 'New customer(s) added!',
        timestamp: new Date(),
        ...data,
      });
      LoggerService.debug('customer-added event emitted', data);
    }
  }

  // Generic emit method for any event
  static emit(eventName, data) {
    const io = SocketService.getIO();
    if (io) {
      io.emit(eventName, data);
      LoggerService.debug(`${eventName} event emitted`, data);
    }
  }
}

export default SocketService;
