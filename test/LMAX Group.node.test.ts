/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { LMAXGroup } from '../nodes/LMAX Group/LMAX Group.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('LMAXGroup Node', () => {
  let node: LMAXGroup;

  beforeAll(() => {
    node = new LMAXGroup();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('LMAX Group');
      expect(node.description.name).toBe('lmaxgroup');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Authentication Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				baseUrl: 'https://web-order.london-demo.lmax.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			},
		};
	});

	describe('login operation', () => {
		it('should authenticate user successfully', async () => {
			const mockResponse = { sessionId: 'test-session-123', success: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('login')
				.mockReturnValueOnce('testuser')
				.mockReturnValueOnce('testpass');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAuthenticationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://web-order.london-demo.lmax.com/secure/login',
				headers: { 'Content-Type': 'application/json' },
				body: { username: 'testuser', password: 'testpass' },
				json: true
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle login error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('login')
				.mockReturnValueOnce('testuser')
				.mockReturnValueOnce('wrongpass');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Authentication failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeAuthenticationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Authentication failed' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('logout operation', () => {
		it('should logout user successfully', async () => {
			const mockResponse = { success: true };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('logout');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAuthenticationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://web-order.london-demo.lmax.com/secure/logout',
				headers: { 'Content-Type': 'application/json' },
				json: true
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('requestToken operation', () => {
		it('should request token successfully', async () => {
			const mockResponse = { token: 'abc123xyz', expiresAt: '2024-01-01T00:00:00Z' };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('requestToken');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAuthenticationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://web-order.london-demo.lmax.com/secure/requestToken',
				headers: { 'Content-Type': 'application/json' },
				json: true
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        baseUrl: 'https://web-order.london-demo.lmax.com',
        sessionToken: 'test-session-token'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getAccount operation', () => {
    it('should get account information successfully', async () => {
      const mockResponse = {
        accountId: '12345',
        currency: 'USD',
        accountType: 'SPREAD_BET'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccount');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://web-order.london-demo.lmax.com/secure/read/account',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'n8n-lmax-node',
          'Authorization': 'Bearer test-session-token'
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle getAccount errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccount');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getAccountState operation', () => {
    it('should get account state successfully', async () => {
      const mockResponse = {
        accountId: '12345',
        balance: 10000,
        availableToTrade: 8000
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountState');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://web-order.london-demo.lmax.com/secure/read/accountState',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'n8n-lmax-node',
          'Authorization': 'Bearer test-session-token'
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle getAccountState errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountState');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Network Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getAccountStateEvents operation', () => {
    it('should get account state events with fromInstructionId', async () => {
      const mockResponse = {
        events: [
          { instructionId: '67890', eventType: 'BALANCE_CHANGE' }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountStateEvents')
        .mockReturnValueOnce('12345');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://web-order.london-demo.lmax.com/secure/read/accountStateEvent',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'n8n-lmax-node',
          'Authorization': 'Bearer test-session-token'
        },
        body: { fromInstructionId: '12345' },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle getAccountStateEvents errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountStateEvents')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Authentication Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Authentication Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('Instrument Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        baseUrl: 'https://web-order.london-demo.lmax.com',
        sessionToken: 'test-session-token'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('searchInstruments operation', () => {
    it('should search instruments successfully', async () => {
      const mockResponse = { instruments: [{ id: '1', name: 'EUR/USD' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchInstruments')
        .mockReturnValueOnce('EUR')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeInstrumentOperations.call(mockExecuteFunctions, items);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://web-order.london-demo.lmax.com/secure/read/searchInstruments',
        qs: { query: 'EUR', offset: 0, size: 50 },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-session-token',
        },
        json: true,
      });
    });

    it('should handle search instruments error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('searchInstruments');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeInstrumentOperations.call(mockExecuteFunctions, items);

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getInstrument operation', () => {
    it('should get instrument details successfully', async () => {
      const mockResponse = { instrument: { id: '1', name: 'EUR/USD' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getInstrument')
        .mockReturnValueOnce('123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeInstrumentOperations.call(mockExecuteFunctions, items);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://web-order.london-demo.lmax.com/secure/read/instrument',
        qs: { instrumentId: '123' },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-session-token',
        },
        json: true,
      });
    });

    it('should handle get instrument error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getInstrument');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeInstrumentOperations.call(mockExecuteFunctions, items);

      expect(result[0].json.error).toBe('Not found');
    });
  });

  describe('subscribeOrderBookStatus operation', () => {
    it('should subscribe to order book status successfully', async () => {
      const mockResponse = { subscriptionId: 'sub123', status: 'active' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('subscribeOrderBookStatus')
        .mockReturnValueOnce('456');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeInstrumentOperations.call(mockExecuteFunctions, items);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://web-order.london-demo.lmax.com/secure/subscribe/orderBookStatus',
          body: expect.objectContaining({
            instrumentId: '456',
            instructionId: expect.any(String),
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-session-token',
          },
          json: true,
        })
      );
    });

    it('should handle subscribe order book status error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('subscribeOrderBookStatus');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Subscription failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeInstrumentOperations.call(mockExecuteFunctions, items);

      expect(result[0].json.error).toBe('Subscription failed');
    });
  });
});

describe('Order Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        sessionToken: 'test-session-token',
        baseUrl: 'https://web-order.london-demo.lmax.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should place a limit order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('placeLimitOrder')
      .mockReturnValueOnce('4001')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1.2500)
      .mockReturnValueOnce('BUY')
      .mockReturnValueOnce('GTC');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      orderId: 'order-123',
      status: 'PENDING',
      instructionId: '12345'
    });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://web-order.london-demo.lmax.com/secure/place/limitOrder',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-session-token',
      },
      json: true,
      body: expect.objectContaining({
        instrumentId: '4001',
        quantity: 1000,
        price: 1.2500,
        side: 'BUY',
        timeInForce: 'GTC',
      }),
    });

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(expect.objectContaining({
      orderId: 'order-123',
      status: 'PENDING',
    }));
  });

  it('should place a market order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('placeMarketOrder')
      .mockReturnValueOnce('4001')
      .mockReturnValueOnce(500)
      .mockReturnValueOnce('SELL');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      orderId: 'order-456',
      status: 'FILLED',
      executedPrice: 1.2485
    });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://web-order.london-demo.lmax.com/secure/place/marketOrder',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-session-token',
      },
      json: true,
      body: expect.objectContaining({
        instrumentId: '4001',
        quantity: 500,
        side: 'SELL',
      }),
    });

    expect(result[0].json.orderId).toBe('order-456');
  });

  it('should cancel an order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelOrder')
      .mockReturnValueOnce('order-123')
      .mockReturnValueOnce('original-456');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      status: 'CANCELLED',
      orderId: 'order-123'
    });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://web-order.london-demo.lmax.com/secure/cancel/order',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-session-token',
      },
      json: true,
      body: expect.objectContaining({
        orderId: 'order-123',
        originalInstructionId: 'original-456',
      }),
    });

    expect(result[0].json.status).toBe('CANCELLED');
  });

  it('should handle errors when placing order fails', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('placeLimitOrder');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid instrument'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid instrument');
  });

  it('should get orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getOrders')
      .mockReturnValueOnce('req-123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      orders: [
        { orderId: 'order-1', status: 'PENDING' },
        { orderId: 'order-2', status: 'FILLED' }
      ]
    });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://web-order.london-demo.lmax.com/secure/read/orders',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-session-token',
      },
      json: true,
      qs: { requestId: 'req-123' },
    });

    expect(result[0].json.orders).toHaveLength(2);
  });
});

describe('Position Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://web-order.london-demo.lmax.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getPositions', () => {
    it('should get positions successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPositions')
        .mockReturnValueOnce('req123');

      const mockResponse = {
        positions: [
          { instrumentId: '123', quantity: '100', openPrice: '1.2345' }
        ]
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePositionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://web-order.london-demo.lmax.com/secure/read/positions',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        qs: { requestId: 'req123' },
        json: true
      });
    });

    it('should handle getPositions error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPositions')
        .mockReturnValueOnce('req123');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executePositionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      )).rejects.toThrow('API Error');
    });
  });

  describe('closePosition', () => {
    it('should close position successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('closePosition')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('MARKET');

      const mockResponse = {
        instructionId: 'inst456',
        status: 'ACCEPTED'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePositionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://web-order.london-demo.lmax.com/secure/close/position',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        body: {
          instrumentId: '123',
          orderType: 'MARKET'
        },
        json: true
      });
    });

    it('should handle closePosition error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('closePosition')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('MARKET');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Close failed'));

      await expect(executePositionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      )).rejects.toThrow('Close failed');
    });
  });

  describe('getPositionEvents', () => {
    it('should get position events successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPositionEvents')
        .mockReturnValueOnce('inst789');

      const mockResponse = {
        events: [
          { instructionId: 'inst790', type: 'POSITION_UPDATE' }
        ]
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePositionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://web-order.london-demo.lmax.com/secure/read/positionEvent',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        body: { fromInstructionId: 'inst789' },
        json: true
      });
    });

    it('should handle getPositionEvents error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPositionEvents')
        .mockReturnValueOnce('inst789');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Events failed'));

      await expect(executePositionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      )).rejects.toThrow('Events failed');
    });
  });
});

describe('MarketData Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        baseUrl: 'https://web-order.london-demo.lmax.com',
        sessionId: 'test-session-id'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn()
      }
    };
  });

  describe('subscribeOrderBook operation', () => {
    it('should subscribe to order book updates successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('subscribeOrderBook')
        .mockReturnValueOnce('EUR/USD');

      const mockResponse = '<?xml version="1.0"?><resp><subscription>success</subscription></resp>';
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeMarketDataOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toBe(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://web-order.london-demo.lmax.com/secure/subscribe/orderBook'
        })
      );
    });

    it('should handle subscription errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('subscribeOrderBook')
        .mockReturnValueOnce('EUR/USD');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Subscription failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeMarketDataOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Subscription failed');
    });
  });

  describe('getCurrentOrderBook operation', () => {
    it('should get current order book snapshot successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCurrentOrderBook')
        .mockReturnValueOnce('EUR/USD');

      const mockResponse = '<?xml version="1.0"?><resp><orderBook>data</orderBook></resp>';
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeMarketDataOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toBe(mockResponse);
    });
  });

  describe('getExecutionEvents operation', () => {
    it('should get execution events successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getExecutionEvents')
        .mockReturnValueOnce('123456');

      const mockResponse = '<?xml version="1.0"?><resp><events>data</events></resp>';
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeMarketDataOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toBe(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://web-order.london-demo.lmax.com/secure/read/executionEvent'
        })
      );
    });
  });
});

describe('Heartbeat Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://web-order.london-demo.lmax.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('sendHeartbeat', () => {
    it('should send heartbeat successfully', async () => {
      const mockResponse = { status: 'alive', timestamp: '2023-01-01T00:00:00Z' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('sendHeartbeat')
        .mockReturnValueOnce('test-token-123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeHeartbeatOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://web-order.london-demo.lmax.com/secure/keepAlive',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: {
          token: 'test-token-123',
          instructionId: expect.any(String),
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle sendHeartbeat errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('sendHeartbeat')
        .mockReturnValueOnce('test-token-123');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid token'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeHeartbeatOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Invalid token' },
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('subscribeHeartbeat', () => {
    it('should subscribe to heartbeat events successfully', async () => {
      const mockResponse = { subscriptionId: 'sub-123', status: 'subscribed' };
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('subscribeHeartbeat');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeHeartbeatOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://web-order.london-demo.lmax.com/secure/subscribe/heartbeat',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: {
          instructionId: expect.any(String),
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle subscribeHeartbeat errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('subscribeHeartbeat');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Subscription failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeHeartbeatOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Subscription failed' },
        pairedItem: { item: 0 },
      }]);
    });
  });
});
});
