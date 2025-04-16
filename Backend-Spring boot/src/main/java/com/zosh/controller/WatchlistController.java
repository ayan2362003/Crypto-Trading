package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.model.Coin;
import com.zosh.model.User;
import com.zosh.model.Watchlist;
import com.zosh.service.CoinService;
import com.zosh.service.UserService;
import com.zosh.service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {
	private final WatchlistService watchlistService;
	private final UserService userService;

	@Autowired
	private CoinService coinService;

	@Autowired
	public WatchlistController(WatchlistService watchlistService, UserService userService) {
		this.watchlistService = watchlistService;
		this.userService = userService;
	}

	@GetMapping("/user")
	public ResponseEntity<Watchlist> getUserWatchlist(@RequestHeader("Authorization") String jwt) throws Exception {

		User user = userService.findUserProfileByJwt(jwt);
		Watchlist watchlist = watchlistService.findUserWatchlist(user.getId());
		return ResponseEntity.ok(watchlist);

	}

	@PostMapping("/create")
	public ResponseEntity<Watchlist> createWatchlist(@RequestHeader("Authorization") String jwt) throws UserException {
		User user = userService.findUserProfileByJwt(jwt);
		Watchlist createdWatchlist = watchlistService.createWatchList(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdWatchlist);
	}

	@GetMapping("/{watchlistId}")
	public ResponseEntity<Watchlist> getWatchlistById(@PathVariable Long watchlistId) throws Exception {

		Watchlist watchlist = watchlistService.findById(watchlistId);
		return ResponseEntity.ok(watchlist);

	}

	@PatchMapping("/add/coin/{coinId}")
	public ResponseEntity<?> addItemToWatchlist(@RequestHeader("Authorization") String jwt,
			@PathVariable String coinId) {

		try {
			User user = userService.findUserProfileByJwt(jwt);
			System.out.println("User ID: " + user.getId());

			// This will now automatically create a watchlist if it doesn’t exist
			Watchlist watchlist = watchlistService.findUserWatchlist(user.getId());

			Coin coin = coinService.findById(coinId);
			if (coin == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Coin not found: " + coinId);
			}

			Coin addedCoin = watchlistService.addItemToWatchlist(coin, user);
			return ResponseEntity.ok(addedCoin);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
		}
	}

}
