import { useEffect, useState } from "react";

import { addItemToWatchlist, getUserWatchlist } from "@/Redux/Watchlist/Action";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";

const Watchlist = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { watchlist, coin } = useSelector((store) => store);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserWatchlist());
  }, [page]);

  const handleAddToWatchlist = (id) => {
    dispatch(addItemToWatchlist(id))
  }
  return (
    <div className="pt-8 lg:px-10">
      <div className="flex items-center pt-5 pb-10 gap-5">
        <BookmarkFilledIcon className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Watchlist</h1>
      </div>

      <Table className="px-5 lg:px-20 border border-border rounded-lg shadow-md dark:shadow-none overflow-hidden">
        <ScrollArea className="max-h-[600px]">
          <TableHeader>
            <TableRow className="sticky top-0 left-0 right-0 bg-background dark:bg-gray-900 border-b border-border z-10">
              <TableHead className="py-4 font-bold text-foreground/80 dark:text-foreground/70">Coin</TableHead>
              <TableHead className="font-bold text-foreground/80 dark:text-foreground/70">SYMBOL</TableHead>
              <TableHead className="font-bold text-foreground/80 dark:text-foreground/70">VOLUME</TableHead>
              <TableHead className="font-bold text-foreground/80 dark:text-foreground/70">MARKET CAP</TableHead>
              <TableHead className="font-bold text-foreground/80 dark:text-foreground/70">24H</TableHead>
              <TableHead className="font-bold text-foreground/80 dark:text-foreground/70">PRICE</TableHead>
              <TableHead className="text-right text-red-700 dark:text-red-500 font-bold">Remove</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="">
            {watchlist.items.map((item) => (
              <TableRow 
                className="hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors duration-200" 
                key={item.id}
              >
                <TableCell
                  onClick={() => navigate(`/market/${item.id}`)}
                  className="font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Avatar className="-z-50 ring-2 ring-primary/10 dark:ring-primary/20">
                    <AvatarImage src={item.image} alt={item.symbol} />
                  </Avatar>
                  <span className="font-semibold hover:text-primary transition-colors duration-200"> {item.name}</span>
                </TableCell>
                <TableCell className="text-foreground/70 dark:text-foreground/60 font-mono uppercase">{item.symbol.toUpperCase()}</TableCell>
                <TableCell className="text-foreground/70 dark:text-foreground/60">{item.total_volume}</TableCell>
                <TableCell className="text-foreground/70 dark:text-foreground/60">{item.market_cap}</TableCell>
                <TableCell
                  className={`${item.market_cap_change_percentage_24h < 0
                      ? "text-red-600 dark:text-red-500"
                      : "text-green-600 dark:text-green-500"
                    } font-semibold`}
                >
                  {item.market_cap_change_percentage_24h}%
                </TableCell>
                <TableCell className="font-semibold">{item.current_price}</TableCell>

                <TableCell className="text-right">
                  <Button 
                    onClick={() => handleAddToWatchlist(item.id)} 
                    className="h-10 w-10 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200" 
                    variant="outline" 
                    size="icon"
                  >
                    <BookmarkFilledIcon className="h-6 w-6" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ScrollArea>
      </Table>
    </div>
  );
};

export default Watchlist;