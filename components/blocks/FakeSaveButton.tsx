import { Button } from "~components/ui/button";

export default function FakeSaveButton() {
    return (
        <Button className="bg-gradient-to-l from-violet-500 to-orange-500 text-white" onClick={() => alert("Settings saved!")}>Save</Button>
    )

}