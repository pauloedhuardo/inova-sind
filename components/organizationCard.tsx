import { StarIcon } from "lucide-react"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

interface OrganizationCardProps {
    organization: {
        name: string,
        score: number
    }
}

const OrganizationCard = ({ organization }: OrganizationCardProps) => {
    return (
        <Card className="min-w-[167px] p-0">
            <CardContent className="p-0 px-1 pt-1">
                <div className="relative h-[159px] w-full">
                    <Badge
                        className="absolute top-2 left-2 space-x-1"
                        variant="secondary"
                    >
                        <StarIcon size={12} className="fill-primary text-primary" />
                        <p className="text-xs font-semibold">{organization.score}</p>
                    </Badge>
                </div>
                <div className="px-2 py-3">
                    <h3 className="truncate font-semibold">{organization.name}</h3>
                </div>
            </CardContent>
        </Card>
    )
}

export default OrganizationCard

