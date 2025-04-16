import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCoin } from "@/Redux/Coin/Action";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

const SearchCoin = () => {
  const dispatch = useDispatch();
  const { coin } = useSelector((store) => store);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  // Memoized search function using useCallback
  const handleSearch = useCallback(
    (searchTerm) => {
      if (searchTerm.trim() !== "") {
        dispatch(searchCoin(searchTerm));
      }
    },
    [dispatch]
  );

  // Debounce Effect with memoized callback
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch(keyword);
    }, 1000); // Wait 500ms after typing

    return () => clearTimeout(delaySearch); // Cleanup previous timeout
  }, [keyword, handleSearch]);

  // Navigate to coin details page
  const handleCoinClick = useCallback(
    (coinId) => {
      navigate(`/market/${coinId}`);
    },
    [navigate]
  );

  if (coin.loading) {
    return <SpinnerBackdrop />;
  }

  return (
    <div className="p-5 lg:p-16 bg-[#121212] text-gray-200 min-h-screen">
      {/* Search Input with aria-label for accessibility */}
      <div className="flex items-center justify-center pb-8 max-w-3xl mx-auto">
        <Input
          className="p-4 w-full border border-gray-700 bg-[#1E1E1E] text-white rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Explore market..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="Search for coins"
        />
        <Button
          className="p-4 ml-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => handleSearch(keyword)}
          aria-label="Search"
        >
          <SearchIcon size={20} />
        </Button>
      </div>

      {/* Conditional rendering for empty state */}
      {keyword && coin.searchCoinList?.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No results found for "{keyword}"
        </div>
      )}

      {/* Table with responsive container */}
      {(!keyword || coin.searchCoinList?.length > 0) && (
        <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md max-w-4xl mx-auto">
          <Table className="w-full bg-[#1E1E1E]">
            <TableHeader className="bg-[#242424] text-gray-300">
              <TableRow className="border-b border-gray-700">
                <TableHead className="py-4 text-left w-1/4">Rank</TableHead>
                <TableHead className="text-left w-2/4">Trading Pair</TableHead>
                <TableHead className="text-right w-1/4">Symbol</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {coin.searchCoinList?.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => handleCoinClick(item.id)}
                  className="cursor-pointer hover:bg-[#292929] transition-all border-b border-gray-700"
                >
                  <TableCell className="py-3 font-medium">
                    {item.market_cap_rank || "N/A"}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 bg-gray-800">
                        <AvatarImage src={item.large} alt={item.name} />
                      </Avatar>
                      <span className="truncate">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold uppercase text-gray-300">
                    {item.symbol}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SearchCoin;