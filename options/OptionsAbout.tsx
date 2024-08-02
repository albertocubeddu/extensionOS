import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import CardHeaderIntro from "~components/blocks/CardHeaderIntro"

export default function OptionsAbout() {
    return (
        <div className="grid gap-6 text-lg">
            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardHeaderIntro title={"Why Extension | OS?"} description={"Extension | OS has been created during the SF Hackaton x Build Club."} />
                </CardHeader>
                <CardContent>
                    It all started a morning on the 27th July 2024 when I decided to partecipate to the San Francisco Hackaton organised by the build club.
                </CardContent>
            </Card>

            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardHeaderIntro title={"Vision"} description={""} />
                </CardHeader>
                <CardContent>
                    AI at Your Fingertips, Anytime, Anywhere.
                </CardContent>
            </Card>

            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardHeaderIntro title={"Mission"} description={""} />
                </CardHeader>
                <CardContent>
                    Imagine a world where every user has access to powerful (LLMs and more) directly within their web browser. By integrating AI
                    into everyday internet browsing, we can revolutionize the way people
                    interact with information online, providing them with instant,
                    intelligent assistance tailored to their needs.
                </CardContent>
            </Card>


            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardHeaderIntro title={"Problem Statement"} description={""} />
                </CardHeader>
                <CardContent>
                    AI is advancing at a pace that is unbearable, and knowing all the models available is not an easy task. Why should we limit our productivity when Artificial Intelligence could help us on our day-to-day?
                </CardContent>
            </Card>

            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardHeaderIntro title={"Who am I?"} description={""} />
                </CardHeader>
                <CardContent>
                    Visit my{" "}
                    <a
                        className="text-blue-600"
                        href="https://www.linkedin.com/in/alberto-cubeddu/"
                        target="_blank"
                        rel="noopener noreferrer">
                        LinkedIn
                    </a>
                </CardContent>
            </Card>
        </div>
    )
}
