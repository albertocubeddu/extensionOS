import { Button } from "~components/ui/button";

/*
Why a Fake button you would ask? Because in the past we used to save things, and the auto-save for how good it seems, it's just a black magic most of people don't undertsands. Jokes apart, check your clarity/hotjar and see how many people are still looking for the save button when you do provide the "auto-save" functionality.... Yeah they are all over 30's *laugh*
*/
export default function FakeSaveButton() {
    return (
        <Button className="bg-gradient-to-l from-violet-500 to-orange-500 text-white" onClick={() => alert("Settings saved!")}>Save</Button>
    )

}