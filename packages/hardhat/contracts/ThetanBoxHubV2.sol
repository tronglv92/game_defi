// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ThetanBoxHubV2 is Ownable {
    /* ========== LIBs ========== */

    using SafeERC20 for IERC20;

    /* ========== STATE VARIABLES ========== */

    address public paymentReceivedAddress;
    address public signer;
    mapping(uint256 => bool) public ids;

    /* ========== EVENTS ========== */

    event ThetanBoxPaid(
        uint256 indexed id,
        address buyer,
        uint256 boxType,
        uint256 price,
        address paymentToken
    );

    /* ========== READ FUNCTIONS ========== */

    function getBuyBoxMessageHash(
        uint256 id,
        uint256 boxType,
        address user,
        uint256 price,
        address paymentErc20,
        uint256 expiredAt
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    user,
                    id,
                    boxType,
                    price,
                    paymentErc20,
                    expiredAt
                )
            );
    }

    /**
     * @dev Identify an address is user address or contract address
     */
    function isContract(address _address) private view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_address)
        }
        return (size > 0);
    }

    /* ========== WRITE FUNCTIONS ========== */

    function setSigner(address _signer) external onlyOwner {
        require(
            _signer != address(0),
            "ThetanBoxPayment: invalid signer address"
        );
        signer = _signer;
    }

    function setPaymentReceivedAddress(address _paymentReceivedAddress)
        public
        onlyOwner
    {
        paymentReceivedAddress = _paymentReceivedAddress;
    }

    /**
     * @dev Thetan box payment buy function
     */
    function buyBoxWithSignature(
        uint256 id,
        uint256 boxType,
        uint256 price,
        address paymentErc20,
        uint256 expiredAt,
        bytes calldata signature
    ) external {
        require(
            tx.origin == msg.sender,
            "ThetanBoxPayment: Only user address is allowed to buy box"
        );
        require(signer != address(0), "Signer has not been set yet");
        require(
            block.timestamp < expiredAt,
            "ThetanBoxPayment: the signature is expired"
        );
        require(boxType > 0, "ThetanBoxPayment: Invalid box type");
        require(price > 0, "ThetanBoxPayment: Invalid payment amount");
        require(
            !ids[id],
            "ThetanBoxPayment: id is used. please send another transaction with new signature"
        );
        verifyBuyBoxSignature(
            id,
            boxType,
            price,
            paymentErc20,
            expiredAt,
            signature
        );

        // Transfer payment
        IERC20 paymentToken = IERC20(paymentErc20);
        uint256 allowToPayAmount = paymentToken.allowance(
            msg.sender,
            address(this)
        );
        require(
            allowToPayAmount >= price,
            "ThetanBoxPayment: Invalid token allowance"
        );
        paymentToken.safeTransferFrom(
            msg.sender,
            paymentReceivedAddress,
            price
        );

        ids[id] = true;
        // Emit payment event
        emit ThetanBoxPaid(id, msg.sender, boxType, price, paymentErc20);
    }

    function buyBoxFreeWithSignature(
        uint256 id,
        uint256 boxType,
        uint256 price,
        address paymentErc20,
        uint256 expiredAt,
        bytes calldata signature
    ) external {
        require(signer != address(0), "Signer has not been set yet");
        require(
            block.timestamp < expiredAt,
            "ThetanBoxPayment: the signature is expired"
        );
        require(boxType > 0, "ThetanBoxPayment: Invalid box type");
        require(price >= 0, "ThetanBoxPayment: Invalid payment amount");
        require(
            !ids[id],
            "ThetanBoxPayment: id is used. please send another transaction with new signature"
        );
        verifyBuyBoxSignature(
            id,
            boxType,
            price,
            paymentErc20,
            expiredAt,
            signature
        );

        // Transfer payment
        IERC20 paymentToken = IERC20(paymentErc20);
        uint256 allowToPayAmount = paymentToken.allowance(
            msg.sender,
            address(this)
        );
        require(
            allowToPayAmount >= price,
            "ThetanBoxPayment: Invalid token allowance"
        );

        if (price > 0) {
            // transfer token from contrat to user
            paymentToken.safeTransfer(msg.sender, price);
            // transfer token from user to contract
            paymentToken.safeTransferFrom(
                msg.sender,
                paymentReceivedAddress,
                price
            );
        }

        ids[id] = true;
        // Emit payment event
        emit ThetanBoxPaid(id, msg.sender, boxType, price, paymentErc20);
    }

    /* ========== VERIFY FUNCTIONS ========== */

    function verifyBuyBoxSignature(
        uint256 id,
        uint256 boxType,
        uint256 price,
        address paymentErc20,
        uint256 expiredAt,
        bytes calldata signature
    ) public view {
        bytes32 criteriaMessageHash = getBuyBoxMessageHash(
            id,
            boxType,
            msg.sender,
            price,
            paymentErc20,
            expiredAt
        );
        bytes32 ethSignedMessageHash = ECDSA.toEthSignedMessageHash(
            criteriaMessageHash
        );
        require(
            ECDSA.recover(ethSignedMessageHash, signature) == signer,
            "ThetanBoxPayment: invalid signature"
        );
    }
}
