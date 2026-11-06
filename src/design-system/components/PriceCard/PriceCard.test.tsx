import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriceCard } from "./PriceCard";

describe("PriceCard", () => {
  it("muestra el nombre de la visita como título y el precio a la vista", () => {
    render(
      <PriceCard
        name="Primera visita"
        price="120 €"
        description="Dibujamos tu árbol."
      />
    );
    expect(
      screen.getByRole("heading", { name: "Primera visita", level: 3 })
    ).toBeVisible();
    expect(screen.getByText("120 €")).toBeVisible();
    expect(screen.getByText("Dibujamos tu árbol.")).toBeVisible();
  });

  it("la nota es opcional", () => {
    const { rerender } = render(
      <PriceCard name="A" price="90 €" description="d" />
    );
    expect(screen.queryByText("Descontable")).toBeNull();
    rerender(
      <PriceCard name="A" price="90 €" description="d" note="Descontable" />
    );
    expect(screen.getByText("Descontable")).toBeVisible();
  });

  it("lleva su acción dentro de la tarjeta", () => {
    render(
      <PriceCard name="A" price="90 €" description="d">
        <a href="#reservar">Reservar</a>
      </PriceCard>
    );
    expect(screen.getByRole("link", { name: "Reservar" })).toBeVisible();
  });

  it("es un artículo con borde y esquinas redondeadas", () => {
    render(<PriceCard name="A" price="1" description="d" data-testid="card" />);
    const style = getComputedStyle(screen.getByTestId("card"));
    expect(style.borderTopWidth).toBe("1px");
    expect(parseFloat(style.borderTopLeftRadius)).toBeGreaterThan(0);
  });
});
