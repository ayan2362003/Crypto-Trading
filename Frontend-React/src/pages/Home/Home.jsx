import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AssetTable } from "./AssetTable";
import { Button } from "@/components/ui/button";
import StockChart from "../StockDetails/StockChart";
import {
  ChatBubbleIcon,
  ChevronLeftIcon,
  Cross1Icon,
  DotIcon,
} from "@radix-ui/react-icons";
import {
  fetchCoinDetails,
  fetchCoinList,
  fetchTreadingCoinList,
  getTop50CoinList,
} from "@/Redux/Coin/Action";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { sendMessage } from "@/Redux/Chat/Action";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

const CATEGORIES = {
  ALL: "all",
  TOP_50: "top50",
  TRADING: "trading"
};

const Home = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(CATEGORIES.ALL);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);

  // Redux state
  const { coin, chatBot, auth } = useSelector((store) => store);
  const { coinList, top50, coinDetails, loading } = coin;
  const { messages, loading: chatLoading } = chatBot;

  // Get JWT token once
  const jwt = auth.jwt || localStorage.getItem("jwt");

  // Fetch initial coin list based on page
  useEffect(() => {
    dispatch(fetchCoinList(page));
  }, [dispatch, page]);

  // Fetch Bitcoin details on initial load
  useEffect(() => {
    dispatch(fetchCoinDetails({
      coinId: "bitcoin",
      jwt
    }));
  }, [dispatch, jwt]);

  // Handle category changes
  useEffect(() => {
    if (category === CATEGORIES.TOP_50) {
      dispatch(getTop50CoinList());
    } else if (category === CATEGORIES.TRADING) {
      dispatch(fetchTreadingCoinList());
    }
  }, [category, dispatch]);

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Memoized handlers
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const toggleChatBot = useCallback(() => {
    setIsBotOpen(prev => !prev);
  }, []);

  const handleInputChange = useCallback((event) => {
    setInputValue(event.target.value);
  }, []);

  const handleKeyPress = useCallback((event) => {
    if (event.key === "Enter" && inputValue.trim()) {
      dispatch(sendMessage({
        prompt: inputValue,
        jwt
      }));
      setInputValue("");
    }
  }, [dispatch, inputValue, jwt]);

  // Category selection buttons
  const renderCategoryButtons = () => (
    <div className="p-3 flex items-center gap-4">
      <Button
        variant={category === CATEGORIES.ALL ? "default" : "outline"}
        onClick={() => setCategory(CATEGORIES.ALL)}
        className="rounded-full"
      >
        All
      </Button>
      <Button
        variant={category === CATEGORIES.TOP_50 ? "default" : "outline"}
        onClick={() => setCategory(CATEGORIES.TOP_50)}
        className="rounded-full"
      >
        Top 50
      </Button>
    </div>
  );

  // Pagination component
  const renderPagination = () => (
    category === CATEGORIES.ALL && (
      <Pagination className="border-t py-3">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </Button>
          </PaginationItem>
          {[1, 2, 3].map(num => (
            <PaginationItem key={num}>
              <PaginationLink
                onClick={() => handlePageChange(num)}
                isActive={page === num}
              >
                {num}
              </PaginationLink>
            </PaginationItem>
          ))}
          {page > 3 && (
            <PaginationItem>
              <PaginationLink onClick={() => { }} isActive>
                {page}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() => handlePageChange(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  );

  // Coin details card
  const renderCoinDetailsCard = () => (
    coinDetails && (
      <div className="bg-slate-800 p-4 rounded-xl shadow-md mt-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={coinDetails?.image?.large} />
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold">{coinDetails?.symbol?.toUpperCase()}</p>
              <DotIcon className="text-gray-400" />
              <p className="text-gray-400">{coinDetails?.name}</p>
            </div>
            <div className="flex items-end gap-3 mt-2">
              <p className="text-2xl font-bold text-white">
                ${coinDetails?.market_data.current_price.usd.toLocaleString()}
              </p>
              <p className={`text-lg font-medium ${coinDetails?.market_data.market_cap_change_24h < 0
                  ? "text-red-500"
                  : "text-green-500"
                }`}>
                {coinDetails?.market_data.market_cap_change_24h.toFixed(2)}
                <span className="ml-1">
                  ({coinDetails?.market_data.market_cap_change_percentage_24h.toFixed(2)}%)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Chat bot component
  const renderChatBot = () => (
    isBotOpen && (
      <div className="rounded-md w-[20rem] md:w-[25rem] lg:w-[25rem] h-[70vh] bg-slate-900">
        <div className="flex justify-between items-center border-b px-6 h-[12%]">
          <p>Chat Bot</p>
          <Button onClick={toggleChatBot} size="icon" variant="ghost">
            <Cross1Icon />
          </Button>
        </div>

        <div className="h-[76%] flex flex-col overflow-y-auto gap-5 px-5 py-2 scroll-container">
          <div className="self-start pb-5 w-auto">
            <div className="justify-end self-end px-5 py-2 rounded-md bg-slate-800 w-auto">
              {`hi, ${auth.user?.fullName}`}
              <p>you can ask crypto related any question</p>
              <p>like, price, market cap extra...</p>
            </div>
          </div>

          {messages.map((item, index) => (
            <div
              ref={index === messages.length - 1 ? chatContainerRef : null}
              key={index}
              className={`${item.role === "user" ? "self-end" : "self-start"} pb-5 w-auto`}
            >
              {item.role === "user" ? (
                <div className="justify-end self-end px-5 py-2 rounded-full bg-slate-800 w-auto">
                  {item.prompt}
                </div>
              ) : (
                <div className="w-full">
                  <div className="bg-slate-700 flex gap-2 py-4 px-4 rounded-md min-w-[15rem] w-full">
                    <p>{item.ans}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {chatLoading && <p>fetching data...</p>}
        </div>

        <div className="h-[12%] border-t">
          <Input
            className="w-full h-full border-none outline-none"
            placeholder="write prompt"
            onChange={handleInputChange}
            value={inputValue}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
    )
  );

  if (loading) {
    return <SpinnerBackdrop />;
  }

  return (
    <div className="relative">
      <div className="lg:flex">
        <div className="lg:w-[50%] border-r">
          {renderCategoryButtons()}

          <AssetTable
            category={category}
            coins={category === CATEGORIES.ALL ? coinList : top50}
          />

          {renderPagination()}
        </div>

        <div className="hidden lg:block lg:w-[50%] p-5">
          <StockChart coinId="bitcoin" />
          {renderCoinDetailsCard()}
        </div>
      </div>

      <section className="absolute bottom-5 right-5 z-40 flex flex-col justify-end items-end gap-2">
        {renderChatBot()}

        <div onClick={toggleChatBot} className="relative w-[10rem] cursor-pointer group">
          <Button className="w-full h-[3rem] gap-2 items-center">
            <MessageCircle
              fill=""
              className="fill-[#1e293b] -rotate-[90deg] stroke-none group-hover:fill-[#1a1a1a]"
              size={30}
            />
            <span className="text-2xl">Chat Bot</span>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;