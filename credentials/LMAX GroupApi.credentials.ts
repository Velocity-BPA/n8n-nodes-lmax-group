import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LMAXGroupApi implements ICredentialType {
	name = 'lmaxGroupApi';
	displayName = 'LMAX Group API';
	documentationUrl = 'https://web-order.london-demo.lmax.com';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://web-order.london-demo.lmax.com',
			placeholder: 'https://web-order.london-demo.lmax.com',
			description: 'Base URL for the LMAX Group API',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			placeholder: 'your-username',
			description: 'Username for LMAX Group account',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Password for LMAX Group account',
			required: true,
		},
		{
			displayName: 'Session Token (Optional)',
			name: 'sessionToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Existing session token if available. If not provided, will authenticate using username/password.',
		},
	];
}