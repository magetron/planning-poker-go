package main

func strcmp(s1, s2 string) int {
	lens := len(s1)
	if lens > len(s2) {
		lens = len(s2)
	}
	for i := 0; i < lens; i++ {
		if s1[i] != s2[i] {
			return int(s1[i]) - int(s2[i])
		}
	}
	return len(s1) - len(s2)
}