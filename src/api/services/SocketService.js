import LoggerService from './LoggerService.js';

class SocketService {
  static #io = null;

  static initialize(io) {
    SocketService.#io = io;
    LoggerService.info('SocketService initialized');
  }

  static getIO() {
    if (!SocketService.#io) {
      LoggerService.warn('SocketService not initialized');
    }
    return SocketService.#io;
  }

  static emit(eventName, data) {
    const io = SocketService.getIO();
    if (io) {
      io.emit(eventName, data);
      LoggerService.debug(`${eventName} event emitted`, data);
    }
  }
}

export default SocketService;
