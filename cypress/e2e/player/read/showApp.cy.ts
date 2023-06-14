import { Context, PermissionLevel } from '@graasp/sdk';

import {
  APP_DATA_CONTAINER_CY,
  APP_SETTING_CONTAINER_CY,
  NEW_APP_DATA_BUTTON_CY,
  PLAYER_VIEW_CY,
  SETTING_VALUE_FIELD_CY,
  UPDATE_APP_SETTING_BUTTON_CY,
  buildDataCy,
  buildTextFieldSelectorCy,
} from '../../../../src/config/selectors';
import { MOCK_APP_DATA } from '../../../fixtures/appData';
import { MOCK_APP_SETTINGS } from '../../../fixtures/appSettings';

describe('Empty App Data', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: MOCK_APP_SETTINGS,
      },
      appContext: {
        context: Context.PLAYER,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });

  it('show app with no data', () => {
    // check that the player view is shown
    cy.get(buildDataCy(PLAYER_VIEW_CY)).should('be.visible');
  });
});
