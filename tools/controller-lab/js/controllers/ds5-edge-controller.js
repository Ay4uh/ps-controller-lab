'use strict';

import DS5Controller from './ds5-controller.js';
import { l } from '../translations.js';

/**
* DualSense Edge Controller implementation
* Extends DS5Controller with Edge-specific functionality
*/
class DS5EdgeController extends DS5Controller {
  constructor(device) {
    super(device);
    this.model = "DS5_Edge";
    // Edge controllers might have different fine-tune values
    this.finetuneMaxValue = 65535; // Same as DS5 for now
  }

  getInputConfig() {
    // Edge controllers have the same input layout as DS5
    return super.getInputConfig();
  }

  async getInfo() {
    return this._getInfo(true); // Pass true for edge controller
  }

  async _getInfo(is_edge) {
    // Get base DS5 info first
    const baseInfo = await super._getInfo(is_edge);
    if (!baseInfo.ok) {
      return baseInfo;
    }

    // Add Edge-specific information
    const edgeInfoItems = [
      { key: l("Controller Type"), value: "DualSense Edge", cat: "hw" },
      { key: l("Replaceable Sticks"), value: "Yes", cat: "hw" },
      { key: l("Customizable Buttons"), value: "Yes", cat: "hw" },
      { key: l("Trigger Stops"), value: "Yes", cat: "hw" },
    ];

    // Merge the info items
    const mergedInfoItems = [...baseInfo.infoItems, ...edgeInfoItems];

    return {
      ...baseInfo,
      infoItems: mergedInfoItems,
    };
  }

  // Override any Edge-specific methods if needed
  // For now, we'll inherit most functionality from DS5Controller
}

export default DS5EdgeController;