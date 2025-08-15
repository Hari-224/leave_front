import React, { useState } from "react";
import Button, {
  PrimaryButton,
  SecondaryButton,
  SuccessButton,
  DangerButton,
  OutlineButton,
  GhostButton,
  LinkButton,
  GradientButton,
  ButtonGroup
} from "./Button";

const ButtonShowcase = () => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const handleAsyncAction = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setCount(prev => prev + 1);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Button Showcase</h1>

      <section>
        <h2 className="font-semibold mb-2">Variants</h2>
        <div className="flex gap-4 flex-wrap">
          <PrimaryButton>Primary</PrimaryButton>
          <SecondaryButton>Secondary</SecondaryButton>
          <SuccessButton>Success</SuccessButton>
          <DangerButton>Danger</DangerButton>
          <OutlineButton>Outline</OutlineButton>
          <GhostButton>Ghost</GhostButton>
          <LinkButton>Link</LinkButton>
          <GradientButton>Gradient</GradientButton>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Sizes & Loading</h2>
        <div className="flex gap-4 flex-wrap">
          <Button size="xs">XS</Button>
          <Button size="sm">SM</Button>
          <Button size="md">MD</Button>
          <Button size="lg">LG</Button>
          <Button size="xl">XL</Button>
          <Button loading={loading} onClick={handleAsyncAction}>
            {loading ? "Loading..." : `Clicked ${count}`}
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Button Group</h2>
        <ButtonGroup>
          <Button>Prev</Button>
          <Button>Current</Button>
          <Button>Next</Button>
        </ButtonGroup>
      </section>
    </div>
  );
};

export default ButtonShowcase;
