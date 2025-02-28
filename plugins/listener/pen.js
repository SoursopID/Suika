/**
 * Copyright (C) 2025 SoursopID
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/
 *
 * This code is part of Suika project
 * (https://github.com/SoursopID/Suika)
 */

export function red(text) {
  return "\x1b[31m" + text + "\x1b[0m";
}

export function green(text) {
  return "\x1b[32m" + text + "\x1b[0m";
}
export function yellow(text) {
  return "\x1b[33m" + text + "\x1b[0m";
}

export function blue(text) {
  return "\x1b[34m" + text + "\x1b[0m";
}

export function magenta(text) {
  return "\x1b[35m" + text + "\x1b[0m";
}

export function cyan(text) {
  return "\x1b[36m" + text + "\x1b[0m";
}

export function white(text) {
  return "\x1b[37m" + text + "\x1b[0m";
}

export function redBG(text) {
  return "\x1b[41m" + text + "\x1b[0m";
}
export function greenBG(text) {
  return "\x1b[42m" + text + "\x1b[0m";
}

export function yellowBG(text) {
  return "\x1b[43m" + text + "\x1b[0m";
}
export function blueBG(text) {
  return "\x1b[44m" + text + "\x1b[0m";
}

export function magentaBG(text) {
  return "\x1b[45m" + text + "\x1b[0m";
}

export function cyanBG(text) {
  return "\x1b[46m" + text + "\x1b[0m";
}

export function whiteBG(text) {
  return "\x1b[47m" + text + "\x1b[0m";
}

