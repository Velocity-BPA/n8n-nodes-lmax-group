/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-lmaxgroup/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class LMAXGroup implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LMAX Group',
    name: 'lmaxgroup',
    icon: 'file:lmaxgroup.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the LMAX Group API',
    defaults: {
      name: 'LMAX Group',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'lmaxgroupApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Authentication',
            value: 'authentication',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Instrument',
            value: 'instrument',
          },
          {
            name: 'Order',
            value: 'order',
          },
          {
            name: 'Position',
            value: 'position',
          },
          {
            name: 'MarketData',
            value: 'marketData',
          },
          {
            name: 'Heartbeat',
            value: 'heartbeat',
          }
        ],
        default: 'authentication',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['authentication'] } },
	options: [
		{
			name: 'Login',
			value: 'login',
			description: 'Authenticate user with credentials',
			action: 'Login user'
		},
		{
			name: 'Logout',
			value: 'logout',
			description: 'End user session',
			action: 'Logout user'
		},
		{
			name: 'Request Token',
			value: 'requestToken',
			description: 'Request security token',
			action: 'Request security token'
		}
	],
	default: 'login',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Get Account', value: 'getAccount', description: 'Get account information', action: 'Get account information' },
    { name: 'Get Account State', value: 'getAccountState', description: 'Get current account state and balances', action: 'Get account state' },
    { name: 'Get Account State Events', value: 'getAccountStateEvents', description: 'Get account state change events', action: 'Get account state events' }
  ],
  default: 'getAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['instrument'] } },
  options: [
    { name: 'Search Instruments', value: 'searchInstruments', description: 'Search available instruments', action: 'Search instruments' },
    { name: 'Get Instrument', value: 'getInstrument', description: 'Get specific instrument details', action: 'Get instrument details' },
    { name: 'Subscribe Order Book Status', value: 'subscribeOrderBookStatus', description: 'Subscribe to instrument status updates', action: 'Subscribe to order book status' }
  ],
  default: 'searchInstruments',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['order'] } },
  options: [
    { name: 'Place Limit Order', value: 'placeLimitOrder', description: 'Place a limit order', action: 'Place a limit order' },
    { name: 'Place Market Order', value: 'placeMarketOrder', description: 'Place a market order', action: 'Place a market order' },
    { name: 'Place Stop Order', value: 'placeStopOrder', description: 'Place a stop order', action: 'Place a stop order' },
    { name: 'Cancel Order', value: 'cancelOrder', description: 'Cancel an existing order', action: 'Cancel an order' },
    { name: 'Amend Stop Loss', value: 'amendStopLoss', description: 'Modify stop loss on position', action: 'Amend stop loss' },
    { name: 'Get Orders', value: 'getOrders', description: 'Get list of orders', action: 'Get orders' },
  ],
  default: 'placeLimitOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['position'] } },
  options: [
    { name: 'Get Positions', value: 'getPositions', description: 'Get all positions', action: 'Get all positions' },
    { name: 'Close Position', value: 'closePosition', description: 'Close a position', action: 'Close a position' },
    { name: 'Get Position Events', value: 'getPositionEvents', description: 'Get position change events', action: 'Get position change events' }
  ],
  default: 'getPositions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['marketData'] } },
  options: [
    { name: 'Subscribe to Order Book', value: 'subscribeOrderBook', description: 'Subscribe to order book updates', action: 'Subscribe to order book' },
    { name: 'Get Current Order Book', value: 'getCurrentOrderBook', description: 'Get current order book snapshot', action: 'Get current order book' },
    { name: 'Unsubscribe from Order Book', value: 'unsubscribeOrderBook', description: 'Unsubscribe from order book', action: 'Unsubscribe from order book' },
    { name: 'Get Execution Events', value: 'getExecutionEvents', description: 'Get trade execution events', action: 'Get execution events' },
    { name: 'Get Order Events', value: 'getOrderEvents', description: 'Get order change events', action: 'Get order events' }
  ],
  default: 'subscribeOrderBook',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['heartbeat'] } },
  options: [
    {
      name: 'Send Heartbeat',
      value: 'sendHeartbeat',
      description: 'Send heartbeat to maintain session',
      action: 'Send heartbeat',
    },
    {
      name: 'Subscribe to Heartbeat',
      value: 'subscribeHeartbeat',
      description: 'Subscribe to heartbeat events',
      action: 'Subscribe to heartbeat events',
    },
  ],
  default: 'sendHeartbeat',
},
{
	displayName: 'Username',
	name: 'username',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['authentication'],
			operation: ['login']
		}
	},
	default: '',
	description: 'Username for authentication'
},
{
	displayName: 'Password',
	name: 'password',
	type: 'string',
	typeOptions: {
		password: true
	},
	required: true,
	displayOptions: {
		show: {
			resource: ['authentication'],
			operation: ['login']
		}
	},
	default: '',
	description: 'Password for authentication'
},
{
  displayName: 'From Instruction ID',
  name: 'fromInstructionId',
  type: 'string',
  displayOptions: { show: { resource: ['account'], operation: ['getAccountStateEvents'] } },
  default: '',
  description: 'Start returning events from this instruction ID onwards',
  placeholder: '12345',
},
{
  displayName: 'Search Query',
  name: 'query',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['instrument'], operation: ['searchInstruments'] } },
  default: '',
  description: 'Search query for instruments',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['instrument'], operation: ['searchInstruments'] } },
  default: 0,
  description: 'Number of records to skip',
},
{
  displayName: 'Size',
  name: 'size',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['instrument'], operation: ['searchInstruments'] } },
  default: 50,
  description: 'Number of records to return',
},
{
  displayName: 'Instrument ID',
  name: 'instrumentId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['instrument'], operation: ['getInstrument', 'subscribeOrderBookStatus'] } },
  default: '',
  description: 'The ID of the instrument',
},
{
  displayName: 'Instrument ID',
  name: 'instrumentId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['placeLimitOrder', 'placeMarketOrder', 'placeStopOrder'] } },
  default: '',
  description: 'The instrument ID for the order',
},
{
  displayName: 'Quantity',
  name: 'quantity',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['placeLimitOrder', 'placeMarketOrder', 'placeStopOrder'] } },
  default: 0,
  description: 'The quantity for the order',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['placeLimitOrder'] } },
  default: 0,
  description: 'The price for the limit order',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['placeLimitOrder', 'placeMarketOrder', 'placeStopOrder'] } },
  options: [
    { name: 'Buy', value: 'BUY' },
    { name: 'Sell', value: 'SELL' },
  ],
  default: 'BUY',
  description: 'The side of the order (buy or sell)',
},
{
  displayName: 'Time in Force',
  name: 'timeInForce',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['placeLimitOrder'] } },
  options: [
    { name: 'Good Till Cancelled', value: 'GTC' },
    { name: 'Fill or Kill', value: 'FOK' },
    { name: 'Immediate or Cancel', value: 'IOC' },
  ],
  default: 'GTC',
  description: 'Time in force for the order',
},
{
  displayName: 'Stop Price',
  name: 'stopPrice',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['placeStopOrder'] } },
  default: 0,
  description: 'The stop price for the stop order',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['cancelOrder'] } },
  default: '',
  description: 'The ID of the order to cancel',
},
{
  displayName: 'Original Instruction ID',
  name: 'originalInstructionId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['cancelOrder'] } },
  default: '',
  description: 'The original instruction ID of the order to cancel',
},
{
  displayName: 'Instruction ID',
  name: 'instructionId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['amendStopLoss'] } },
  default: '',
  description: 'The instruction ID for the position',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['amendStopLoss'] } },
  default: 0,
  description: 'The offset for the stop loss',
},
{
  displayName: 'Request ID',
  name: 'requestId',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['getOrders'] } },
  default: '',
  description: 'Optional request ID for tracking',
},
{
  displayName: 'Request ID',
  name: 'requestId',
  type: 'string',
  displayOptions: { show: { resource: ['position'], operation: ['getPositions'] } },
  default: '',
  description: 'Unique identifier for the request'
},
{
  displayName: 'Instrument ID',
  name: 'instrumentId',
  type: 'string',
  displayOptions: { show: { resource: ['position'], operation: ['closePosition'] } },
  default: '',
  required: true,
  description: 'ID of the instrument to close position for'
},
{
  displayName: 'Order Type',
  name: 'orderType',
  type: 'options',
  displayOptions: { show: { resource: ['position'], operation: ['closePosition'] } },
  options: [
    { name: 'Market', value: 'MARKET' },
    { name: 'Limit', value: 'LIMIT' },
    { name: 'Stop', value: 'STOP' }
  ],
  default: 'MARKET',
  description: 'Type of order to use when closing the position'
},
{
  displayName: 'From Instruction ID',
  name: 'fromInstructionId',
  type: 'string',
  displayOptions: { show: { resource: ['position'], operation: ['getPositionEvents'] } },
  default: '',
  description: 'Starting instruction ID to get position events from'
},
{
  displayName: 'Instrument ID',
  name: 'instrumentId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['marketData'],
      operation: ['subscribeOrderBook', 'getCurrentOrderBook', 'unsubscribeOrderBook']
    }
  },
  default: '',
  description: 'The ID of the financial instrument',
},
{
  displayName: 'From Instruction ID',
  name: 'fromInstructionId',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['marketData'],
      operation: ['getExecutionEvents', 'getOrderEvents']
    }
  },
  default: '',
  description: 'Starting instruction ID to retrieve events from',
},
{
  displayName: 'Token',
  name: 'token',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['heartbeat'],
      operation: ['sendHeartbeat'],
    },
  },
  default: '',
  description: 'Session token for authentication',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'authentication':
        return [await executeAuthenticationOperations.call(this, items)];
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'instrument':
        return [await executeInstrumentOperations.call(this, items)];
      case 'order':
        return [await executeOrderOperations.call(this, items)];
      case 'position':
        return [await executePositionOperations.call(this, items)];
      case 'marketData':
        return [await executeMarketDataOperations.call(this, items)];
      case 'heartbeat':
        return [await executeHeartbeatOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAuthenticationOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('lmaxgroupApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'login': {
					const username = this.getNodeParameter('username', i) as string;
					const password = this.getNodeParameter('password', i) as string;
					
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/secure/login`,
						headers: {
							'Content-Type': 'application/json'
						},
						body: {
							username,
							password
						},
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'logout': {
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/secure/logout`,
						headers: {
							'Content-Type': 'application/json'
						},
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'requestToken': {
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/secure/requestToken`,
						headers: {
							'Content-Type': 'application/json'
						},
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i }
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i }
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('lmaxgroupApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const baseHeaders = {
        'Content-Type': 'application/json',
        'User-Agent': 'n8n-lmax-node',
      };

      if (credentials.sessionToken) {
        baseHeaders['Authorization'] = `Bearer ${credentials.sessionToken}`;
      }

      switch (operation) {
        case 'getAccount': {
          const options = {
            method: 'GET',
            url: `${credentials.baseUrl}/secure/read/account`,
            headers: baseHeaders,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountState': {
          const options = {
            method: 'GET',
            url: `${credentials.baseUrl}/secure/read/accountState`,
            headers: baseHeaders,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountStateEvents': {
          const fromInstructionId = this.getNodeParameter('fromInstructionId', i) as string;
          
          const requestBody: any = {};
          if (fromInstructionId) {
            requestBody.fromInstructionId = fromInstructionId;
          }

          const options = {
            method: 'POST',
            url: `${credentials.baseUrl}/secure/read/accountStateEvent`,
            headers: baseHeaders,
            body: requestBody,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeInstrumentOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('lmaxgroupApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'searchInstruments': {
          const query = this.getNodeParameter('query', i) as string;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          const size = this.getNodeParameter('size', i, 50) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/secure/read/searchInstruments`,
            qs: {
              query,
              offset,
              size,
            },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.sessionToken}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getInstrument': {
          const instrumentId = this.getNodeParameter('instrumentId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/secure/read/instrument`,
            qs: {
              instrumentId,
            },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.sessionToken}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'subscribeOrderBookStatus': {
          const instrumentId = this.getNodeParameter('instrumentId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/secure/subscribe/orderBookStatus`,
            body: {
              instrumentId,
              instructionId: Date.now().toString(),
            },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.sessionToken}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('lmaxgroupApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const baseOptions: any = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${credentials.sessionToken}`,
        },
        json: true,
      };

      switch (operation) {
        case 'placeLimitOrder': {
          const instrumentId = this.getNodeParameter('instrumentId', i) as string;
          const quantity = this.getNodeParameter('quantity', i) as number;
          const price = this.getNodeParameter('price', i) as number;
          const side = this.getNodeParameter('side', i) as string;
          const timeInForce = this.getNodeParameter('timeInForce', i) as string;

          const options = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/secure/place/limitOrder`,
            body: {
              instrumentId,
              quantity,
              price,
              side,
              timeInForce,
              instructionId: Date.now().toString(),
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'placeMarketOrder': {
          const instrumentId = this.getNodeParameter('instrumentId', i) as string;
          const quantity = this.getNodeParameter('quantity', i) as number;
          const side = this.getNodeParameter('side', i) as string;

          const options = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/secure/place/marketOrder`,
            body: {
              instrumentId,
              quantity,
              side,
              instructionId: Date.now().toString(),
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'placeStopOrder': {
          const instrumentId = this.getNodeParameter('instrumentId', i) as string;
          const quantity = this.getNodeParameter('quantity', i) as number;
          const stopPrice = this.getNodeParameter('stopPrice', i) as number;
          const side = this.getNodeParameter('side', i) as string;

          const options = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/secure/place/stopOrder`,
            body: {
              instrumentId,
              quantity,
              stopPrice,
              side,
              instructionId: Date.now().toString(),
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const originalInstructionId = this.getNodeParameter('originalInstructionId', i) as string;

          const options = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/secure/cancel/order`,
            body: {
              orderId,
              originalInstructionId,
              instructionId: Date.now().toString(),
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'amendStopLoss': {
          const instructionId = this.getNodeParameter('instructionId', i) as string;
          const offset = this.getNodeParameter('offset', i) as number;

          const options = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/secure/amend/stopLossOffset`,
            body: {
              instructionId,
              offset,
              newInstructionId: Date.now().toString(),
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrders': {
          const requestId = this.getNodeParameter('requestId', i) as string;

          const options = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/secure/read/orders`,
            qs: requestId ? { requestId } : {},
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executePositionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('lmaxgroupApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getPositions': {
          const requestId = this.getNodeParameter('requestId', i) as string;
          
          const requestBody: any = {};
          if (requestId) {
            requestBody.requestId = requestId;
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/secure/read/positions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            qs: requestBody,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'closePosition': {
          const instrumentId = this.getNodeParameter('instrumentId', i) as string;
          const orderType = this.getNodeParameter('orderType', i) as string;

          const requestBody = {
            instrumentId,
            orderType
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/secure/close/position`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: requestBody,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPositionEvents': {
          const fromInstructionId = this.getNodeParameter('fromInstructionId', i) as string;

          const requestBody: any = {};
          if (fromInstructionId) {
            requestBody.fromInstructionId = fromInstructionId;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/secure/read/positionEvent`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: requestBody,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeMarketDataOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('lmaxgroupApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'subscribeOrderBook': {
          const instrumentId = this.getNodeParameter('instrumentId', i) as string;
          const instructionId = Date.now().toString();
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/secure/subscribe/orderBook`,
            headers: {
              'Content-Type': 'application/xml',
              'Cookie': credentials.sessionId || ''
            },
            body: `<?xml version="1.0" encoding="UTF-8"?><req id="${instructionId}"><body><subscription><type>ORDER_BOOK</type><instrumentId>${instrumentId}</instrumentId></subscription></body></req>`,
            json: false
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCurrentOrderBook': {
          const instrumentId = this.getNodeParameter('instrumentId', i) as string;
          const instructionId = Date.now().toString();
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/secure/subscribe/currentOrderBook`,
            headers: {
              'Content-Type': 'application/xml',
              'Cookie': credentials.sessionId || ''
            },
            body: `<?xml version="1.0" encoding="UTF-8"?><req id="${instructionId}"><body><subscription><type>CURRENT_ORDER_BOOK</type><instrumentId>${instrumentId}</instrumentId></subscription></body></req>`,
            json: false
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'unsubscribeOrderBook': {
          const instrumentId = this.getNodeParameter('instrumentId', i) as string;
          const instructionId = Date.now().toString();
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/secure/unsubscribe/orderBook`,
            headers: {
              'Content-Type': 'application/xml',
              'Cookie': credentials.sessionId || ''
            },
            body: `<?xml version="1.0" encoding="UTF-8"?><req id="${instructionId}"><body><unsubscription><type>ORDER_BOOK</type><instrumentId>${instrumentId}</instrumentId></unsubscription></body></req>`,
            json: false
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getExecutionEvents': {
          const fromInstructionId = this.getNodeParameter('fromInstructionId', i) as string;
          const instructionId = Date.now().toString();
          
          const bodyContent = fromInstructionId 
            ? `<fromInstructionId>${fromInstructionId}</fromInstructionId>`
            : '';
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/secure/read/executionEvent`,
            headers: {
              'Content-Type': 'application/xml',
              'Cookie': credentials.sessionId || ''
            },
            body: `<?xml version="1.0" encoding="UTF-8"?><req id="${instructionId}"><body>${bodyContent}</body></req>`,
            json: false
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrderEvents': {
          const fromInstructionId = this.getNodeParameter('fromInstructionId', i) as string;
          const instructionId = Date.now().toString();
          
          const bodyContent = fromInstructionId 
            ? `<fromInstructionId>${fromInstructionId}</fromInstructionId>`
            : '';
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/secure/read/orderEvent`,
            headers: {
              'Content-Type': 'application/xml',
              'Cookie': credentials.sessionId || ''
            },
            body: `<?xml version="1.0" encoding="UTF-8"?><req id="${instructionId}"><body>${bodyContent}</body></req>`,
            json: false
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeHeartbeatOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('lmaxgroupApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'sendHeartbeat': {
          const token = this.getNodeParameter('token', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/secure/keepAlive`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              token,
              instructionId: Date.now().toString(),
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'subscribeHeartbeat': {
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/secure/subscribe/heartbeat`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              instructionId: Date.now().toString(),
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
          );
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
