import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { Checkbox } from '../../components/Checkbox/Checkbox'
import { CheckboxGroup } from '../../components/CheckboxGroup/CheckboxGroup'

describe('CheckboxGroup (Component)', () => {
	it('Renders the fields for CheckboxGroup correctly', async () => {
		render(
			<CheckboxGroup name="preferences" label="Preferences">
				<Checkbox
					id={'item-1'}
					name="preferences"
					value={'baseball'}
					className="visually-hidden"
					noValidate
					label={'Baseball'}
				/>
				<Checkbox
					id={'item-2'}
					name="preferences"
					value={'hockey'}
					className="visually-hidden"
					noValidate
					label={'Hockey'}
				/>
			</CheckboxGroup>,
		)
		expect(screen.getByRole('group', { name: 'Preferences' })).toBeInTheDocument()
		expect(screen.getByRole('alert')).toBeInTheDocument()
		const inputEls = screen.getAllByRole('checkbox')
		expect(inputEls.length).toEqual(2)
	})

	it('WIll not render the legend and error role fields on CheckboxGroup', async () => {
		render(
			<CheckboxGroup name="preferences" noValidate>
				<Checkbox
					id={'item-1'}
					name="preferences"
					value={'baseball'}
					className="visually-hidden"
					noValidate
					label={'Baseball'}
				/>
				<Checkbox
					id={'item-2'}
					name="preferences"
					value={'hockey'}
					className="visually-hidden"
					noValidate
					label={'Hockey'}
				/>
			</CheckboxGroup>,
		)
		expect(screen.queryByRole('group', { name: 'Preferences' })).not.toBeInTheDocument()
		expect(screen.queryByRole('alert')).not.toBeInTheDocument()
		const inputEls = screen.getAllByRole('checkbox')
		expect(inputEls.length).toEqual(2)
	})
})
