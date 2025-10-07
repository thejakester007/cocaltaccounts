import React from "react";

type SectionHeaderProps = {
	title: string | React.ReactNode;
	subtitle?: string | React.ReactNode;
	/** Simple action link on the right (optional). */
	actionHref?: string;
	actionText?: string;
	/** Use this to render custom controls on the right instead of actionHref/text. */
	rightSlot?: React.ReactNode;
	/** Extra classes for the wrapper. */
	className?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
	title,
	subtitle,
	actionHref,
	actionText,
	rightSlot,
	className,
}) => {
	return (
		<div className={`mb-3 flex items-start justify-between gap-3 ${className ?? ""}`}>
			<div className="min-w-0">
				<h2 className="text-lg font-medium leading-tight truncate">{title}</h2>
				{subtitle ? (
					<p className="mt-0.5 text-xs opacity-70 whitespace-pre-line">{subtitle}</p>
				) : null}
			</div>

			<div className="shrink-0">
				{rightSlot
					? rightSlot
					: actionHref && actionText
						? (
							<a
								href={actionHref}
								className="text-sm text-emerald-400 hover:text-emerald-300"
								aria-label={typeof title === "string" ? `${actionText} for ${title}` : actionText}
							>
								{actionText}
							</a>
						)
						: null}
			</div>
		</div>
	);
};

export default SectionHeader;
