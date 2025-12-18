export default function ArrowDropDown(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			className="arrow-dropdown"
			width="10"
			height="6"
			viewBox="0 0 10 6"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path fillRule="evenodd" clipRule="evenodd" d="M0 0H10L5 6L0 0Z" fill="#fff" />
		</svg>
	)
}
