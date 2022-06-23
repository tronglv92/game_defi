pragma solidity >=0.8.0 <0.9.0;

//SPDX-License-Identifier: MIT
import "hardhat/console.sol";
import "./YourNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract MarketPlaceNFT is Ownable, IERC721Receiver {
    YourNFT internal yourNFT;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    struct MarketItem {
        uint256 tokenId;
        bytes32 itemId;
        uint256 price;
        bool sale;
        address payable seller;
        address payable owner;
        bool mint;
        // 0: in marketing, 1: in game
        uint256 state;
    }
    mapping(bytes32 => MarketItem) public forSale;
    mapping(uint256 => MarketItem) public tokenIdToItem;

    constructor(
        bytes32[] memory assetsForSale,
        uint256[] memory prices,
        address _nftAddress
    ) {
        yourNFT = YourNFT(_nftAddress);
        require(assetsForSale.length == prices.length, "Length is not same");
        for (uint256 i = 0; i < assetsForSale.length; i++) {
            forSale[assetsForSale[i]] = MarketItem({
                itemId: assetsForSale[i],
                price: prices[i],
                sale: true,
                seller: payable(address(0)),
                owner: payable(address(0)),
                mint: false,
                tokenId: 0,
                state: 0
            });
        }
    }

    function uploadNFT(bytes32[] memory assetsForSale, uint256[] memory prices)
        public
        onlyOwner
    {
        require(assetsForSale.length == prices.length, "Length is not same");
        for (uint256 i = 0; i < assetsForSale.length; i++) {
            forSale[assetsForSale[i]] = MarketItem({
                itemId: assetsForSale[i],
                price: prices[i],
                sale: true,
                seller: payable(address(0)),
                owner: payable(address(0)),
                mint: false,
                tokenId: 0,
                state: 0
            });
        }
    }

    function mintMarketItem(string memory _tokenURI)
        public
        payable
        returns (uint256)
    {
        bytes32 uriHash = keccak256(abi.encodePacked(_tokenURI));
        MarketItem storage item = forSale[uriHash];
        //make sure they are only minting something that is market "forsale"
        require(item.sale, "NOT FOR SALE");
        require(!item.mint, "NFT is minted");
        require(item.price == msg.value, "Invalid price");

        item.sale = false;

        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        console.log("id", id);
        item.tokenId = id;

        item.mint = true;
        item.owner = payable(msg.sender);
        item.seller = payable(address(0));

        tokenIdToItem[id] = item;

        yourNFT.mintItem(_tokenURI, id, msg.sender);

        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Transanction to owner error");

        return id;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }

    function getSaleFromTokenId(uint256 tokenId) public view returns (bool) {
        return tokenIdToItem[tokenId].sale;
    }
}
