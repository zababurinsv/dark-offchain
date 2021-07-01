#!/bin/bash

sed -i "s/\@DarkPayCoin\/types\/substrate\/interfaces\/DarkPayCoin/\.\/interfaces\/DarkPayCoin/" ./packages/types/src/substrate/interfaceRegistry.ts
