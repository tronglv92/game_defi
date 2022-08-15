package util

import (
	"fmt"
	"math/rand"
	"strings"
	"time"
)

const alphabet = "abcdefghijklmnopqrstuvwxyz"

func init() {
	rand.Seed(time.Now().UnixMicro())
}

// RandomInt generates a random integer between min and max
func RandomInt(min, max int64) int64 {
	return min + rand.Int63n(max-min+1) // min -> max
}
func RandomFloat(min, max float32) string {
	randomF := (min + rand.Float32()*(max-min)) // min -> max
	return fmt.Sprintf("%f", randomF)
}

//RandomString generates a random string of lenght n
func RandomString(n int) string {
	var sb strings.Builder
	k := len(alphabet)

	for i := 0; i < n; i++ {
		c := alphabet[rand.Intn(k)]
		sb.WriteByte(c)
	}

	return sb.String()
}

// RandomImage generates a random image
func RandomImage() string {
	return fmt.Sprintf("%s.png", RandomString(6))
}

// RandomName generates a random  name
func RandomName() string {
	return RandomString(6)
}

// RandomType generates a random type
func RandomType() int64 {
	return RandomInt(0, 3)
}

// RandomLevel generates a random level
func RandomLevel() int64 {
	return RandomInt(1, 5)
}

// RandomPrice generates a random price
func RandomPrice() int64 {
	return RandomInt(0, 1000)
}

// RandomStar generates a random star
func RandomStar() int64 {
	return RandomInt(1, 5)
}

func RandomNonce() int64 {
	return rand.Int63()
}
