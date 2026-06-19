'use strict';

// Test that all modules can be imported correctly
import { sleep } from './utils.js';
import { l } from './translations.js';
import Storage from './storage.js';
import { initControllerManager } from './controller-manager.js';
import ControllerFactory from './controllers/controller-factory.js';
import BaseController from './controllers/base-controller.js';
import DS4Controller from './controllers/ds4-controller.js';
import DS5Controller from './controllers/ds5-controller.js';
import DS5EdgeController from './controllers/ds5-edge-controller.js';
import XboxController from './controllers/xbox-controller.js';

console.log('All modules imported successfully');

// Test ControllerFactory
console.log('Supported models:', ControllerFactory.getSupportedModels());

// Test storage
Storage.setString('test', 'value');
console.log('Storage test:', Storage.getString('test'));

// Test translations
console.log('Translation test:', l('error'));

// Test that controller classes extend BaseController
console.log('DS4 instanceof BaseController:', new DS4Controller({}) instanceof BaseController);
console.log('DS5 instanceof BaseController:', new DS5Controller({}) instanceof BaseController);
console.log('DS5Edge instanceof BaseController:', new DS5EdgeController({}) instanceof BaseController);
console.log('Xbox instanceof BaseController:', new XboxController({}) instanceof BaseController);

console.log('All tests passed!');