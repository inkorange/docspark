import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ScaleDiagram, ScaleItem } from '~/packages/core'

describe('ScaleDiagram (Component)', () => {
	afterEach(() => jest.resetAllMocks())

	it('Renders component by default', async () => {
		const onChangeFn = jest.fn()
		render(
			<ScaleDiagram options={['loose', 'fitted', 'compression']} selectedOption={0}>
				<ScaleItem label="Loose" description="Fuller Cut" />
				<ScaleItem label="Fitted" description="Streamlined Fit" />
				<ScaleItem label="Compression" description="Ultra-tight Fit" />
			</ScaleDiagram>,
		)

		const options = screen.getByTestId('diagram-options').getElementsByTagName('li')
		expect(options).toHaveLength(3)
		// first option is selected
		expect(options[0].getElementsByTagName('svg')[0].getElementsByTagName('circle')).toHaveLength(2)
		// second option is not selected
		expect(options[1].getElementsByTagName('svg')[0].getElementsByTagName('circle')).toHaveLength(0)
	})
})
