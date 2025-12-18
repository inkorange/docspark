import PlusCircleIcon from '../PlusCircleIcon'

import styles from './PlusCircleIconAnimated.module.scss'
import type { IconProps } from '../icons'

export default function PlusCircleIconAnimated(props: IconProps) {
	return <PlusCircleIcon className={styles.animation} {...props} />
}
