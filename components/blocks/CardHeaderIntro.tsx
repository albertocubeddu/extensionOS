import { Badge } from "~components/ui/badge";
import { CardDescription, CardTitle } from "~components/ui/card";

interface CardHeaderIntroProps {
    title: string,
    description: string
    badgeText?: string
}

export default function CardHeaderIntro({ title, description, badgeText = "" }: CardHeaderIntroProps) {
    return (
        <>
            <CardTitle
                className="os-text-gradient font-sans uppercase tracking-normal text-transparent text-4xl font-bold"
            >
                <div className="flex justify-between w-full">
                    <span>{title}</span>
                    {badgeText && (
                        <Badge
                            variant="outline"
                            className="mb-2 h-5 text-white border-violet-500 bg-transparent">
                            {badgeText}
                        </Badge>
                    )}
                </div>
            </CardTitle>

            <CardDescription className="text-sm text-gray-300">
                {description}
            </CardDescription>
        </>
    )
}