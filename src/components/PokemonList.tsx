import { useEffect, useState } from "react";
import getColorsByType, { pokemonTypes } from "@/helper/PokemonTypes";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "./ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import getToggleVariants from "@/helper/ToggleVariants";
import { Button } from "./ui/button";
import type { Pokemon } from "@/types/pokemon";

const LIMIT = 24;

export default function PokemonList() {
  const [page, setPage] = useState(1);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [type, setTypes] = useState<(typeof pokemonTypes)[number][]>([]);

  const fetchPokemon = async (pageNumber: number) => {
    setLoading(true);

    const offset = (pageNumber - 1) * LIMIT;

    if (type.length === 0) {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${LIMIT}&offset=${offset}`,
      );
      const data = await res.json();

      setTotal(data.count);

      const detailed = await Promise.all(
        data.results.map(async (poke: any) => {
          const res = await fetch(poke.url);
          return res.json();
        }),
      );

      setPokemon(detailed);
    } else {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type[0]}`);
      const data = await res.json();

      const allPokemon = data.pokemon;

      setTotal(allPokemon.length);

      //  PAGINACIÓN MANUAL
      const paginated = allPokemon.slice(offset, offset + LIMIT);

      const detailed = await Promise.all(
        paginated.map(async (poke: any) => {
          const res = await fetch(poke.pokemon.url);
          return res.json();
        }),
      );

      setPokemon(detailed);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPokemon(page);
  }, [page, type]);
  const getVisiblePages = () => {
    const pages = [];

    let start = Math.max(page - 2, 1);
    let end = Math.min(page + 2, totalPages);

    if (page <= 3) {
      start = 1;
      end = Math.min(5, totalPages);
    }

    if (page >= totalPages - 2) {
      start = Math.max(totalPages - 4, 1);
      end = totalPages;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const totalPages = Math.ceil(total / LIMIT);
  return (
    <div className=" w-full flex flex-col items-center justify-center p-4">
      {pokemonTypes.length > 0 && (
        <div className="flex gap-2 mb-4">
          <ToggleGroup
            spacing={1}
            type="single"
            value={type[0] || ""}
            onValueChange={(value) => {
              if (!value) {
                setTypes([]);
              } else {
                setTypes([value as (typeof pokemonTypes)[number]]);
              }
              setPage(1);
            }}
          >
            {pokemonTypes.map((t) => (
              <ToggleGroupItem
                className="cursor-pointer"
                variant={getToggleVariants(t)}
                key={t}
                value={t}
              >
                {t.toUpperCase()}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}
      {loading ? (
        <div className="grid w-full lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <Card className="w-full max-w-xs">
              <CardHeader>
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="aspect-video w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid w-full lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-4 ">
          {pokemon.map((poke) => (
            <Button
              className="w-full h-full"
              variant={"ghost"}
              size={"normal"}
              asChild
            >
              <a href={`/pokedex/${poke.name}`} data-astro-prefetch>
                <Card
                  key={poke.id}
                  className={`w-full max-w-xl text-white hover:scale-[1.02] transition-all  shadow-lg hover:shadow-primary/50 `}
                  style={{
                    background: `linear-gradient(135deg, ${getColorsByType(
                      poke.types[0].type.name,
                    )}, ${poke.types[1]?.type.name !== undefined ? getColorsByType(poke?.types[1]?.type.name) : "lightgray"})`,
                    borderColor: "lightgrey",
                    // borderImage: `linear-gradient(135deg, ${getColorsByType(poke?.types[0]?.type.name)}, ${getColorsByType(poke?.types[0]?.type.name)}) 1`,
                  }}
                >
                  <CardHeader className="flex justify-between">
                    <div>
                      <CardTitle>{poke.name.toUpperCase()}</CardTitle>
                      <CardDescription>#{poke.id}</CardDescription>
                    </div>
                    <CardAction>
                      <div className="flex gap-1 flex-wrap ml-8">
                        {poke.types.map((type: { type: { name: string } }) => (
                          <Badge
                            key={type.type.name}
                            style={{
                              backgroundColor: getColorsByType(type.type.name),
                            }}
                          >
                            {type.type.name.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    {poke.sprites.front_default && (
                      <img
                        width={150}
                        height={150}
                        src={poke.sprites.front_default}
                        alt={poke.name}
                        style={{ viewTransitionName: `sprite-${poke.name}` }} // 👈
                      />
                    )}
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between w-full">
                      <div className=" p-1 rounded">
                        <strong>Height:</strong> {poke.height}
                      </div>
                      <div className=" p-1 rounded">
                        <strong>Weight:</strong> {poke.weight}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </a>
            </Button>
          ))}
        </div>
      )}

      <Pagination className="mt-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className={`cursor-pointer ${page === 1 ? "opacity-50 pointer-events-none" : ""}`}
            />
          </PaginationItem>

          {page > 3 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {getVisiblePages().map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={() => setPage(p)}
                isActive={page === p}
                className="cursor-pointer"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {page < totalPages - 2 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => setPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
