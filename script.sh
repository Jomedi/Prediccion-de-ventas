#!/bin/bash

ng build
npx cap sync
npx cap open android